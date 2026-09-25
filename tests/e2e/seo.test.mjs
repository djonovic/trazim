// SEO checks against a production build (no browser needed):
//
//   pnpm build && pnpm start -p 3100   # in another terminal
//   node tests/e2e/seo.test.mjs        # E2E_BASE_URL overrides http://localhost:3100
//
// Every sitemap URL must return 200, be indexable, self-canonical and have
// reciprocal hreflang; internal links from hubs must only point at indexable
// combinations; FAQ answers must be in the raw HTML; social images must be
// 1200×630 PNGs.
process.loadEnvFile(".env.local");

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const local = (url) => url.replace(SITE, BASE);
// "https://trazim.me" and "https://trazim.me/" are the same URL.
const norm = (url) => (url ?? "").replace(/\/$/, "");

let failures = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "✓" : "✗"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) failures++;
};

const get = async (url) => {
  const res = await fetch(local(url), { redirect: "manual" });
  return { res, text: await res.text() };
};
const attr = (html, re) => html.match(re)?.[1] ?? null;
const hreflangs = (html) =>
  Object.fromEntries(
    [
      ...html.matchAll(
        /<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g,
      ),
    ].map((m) => [m[1], m[2]]),
  );

// --- robots + sitemaps ------------------------------------------------------------
const robots = await get(`${SITE}/robots.txt`);
check(
  "robots.txt allows all, blocks private areas, lists the sitemap",
  robots.res.status === 200 &&
    robots.text.includes("Disallow: /panel/") &&
    robots.text.includes("User-Agent: OAI-SearchBot") &&
    robots.text.includes(`Sitemap: ${SITE}/sitemap.xml`),
);

const index = await get(`${SITE}/sitemap.xml`);
const sitemapUrls = [...index.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
check(
  "sitemap index lists 6 sitemaps",
  sitemapUrls.length === 6,
  String(sitemapUrls.length),
);

const urls = [];
for (const sm of sitemapUrls) {
  const { res, text } = await get(sm);
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check(
    `${sm.split("/").pop()} is valid (${locs.length} URLs)`,
    res.status === 200 && text.startsWith("<?xml"),
  );
  urls.push(...locs);
}
const inSitemap = new Set(urls.map(norm));

// --- every sitemap URL: 200, indexable, canonical, hreflang ----------------------------
let bad = [];
const queue = [...urls];
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    const { res, text } = await get(url);
    const canonical = attr(text, /<link rel="canonical" href="([^"]+)"/);
    const langs = hreflangs(text);
    const problems = [];
    if (res.status !== 200) problems.push(`status ${res.status}`);
    if (/<meta name="robots" content="[^"]*noindex/.test(text))
      problems.push("noindex");
    if (norm(canonical) !== norm(url)) problems.push(`canonical ${canonical}`);
    if (!Object.values(langs).map(norm).includes(norm(url)))
      problems.push("not in own hreflang set");
    if (!langs["x-default"]) problems.push("no x-default");
    for (const alt of Object.values(langs))
      if (!inSitemap.has(norm(alt)))
        problems.push(`alternate not in sitemap: ${alt}`);
    if (problems.length) bad.push(`${url}: ${problems.join(", ")}`);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
check(
  `all ${urls.length} sitemap URLs are 200, indexable, self-canonical with reciprocal hreflang`,
  bad.length === 0,
  bad.slice(0, 5).join(" | "),
);

// --- hub pages only link to indexable combinations --------------------------------------
const comboPattern = /^\/(?:en\/|ru\/)?[a-z0-9-]+-[a-z0-9-]+$/;
bad = [];
for (const hub of [
  "/",
  "/usluge/vodoinstalater",
  "/gradovi/podgorica",
  "/vodoinstalater-podgorica",
  "/en",
  "/ru",
]) {
  const { text } = await get(`${SITE}${hub}`);
  const links = [...text.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const href of new Set(links)) {
    if (!comboPattern.test(href) || href.startsWith("/b/")) continue;
    const url = `${SITE}${href}`;
    // Static pages like /o-nama or /za-biznise also match the pattern; only
    // flag links that resolve to a noindex page.
    if (inSitemap.has(norm(url))) continue;
    const page = await get(url);
    if (page.res.status === 200 && /content="noindex/.test(page.text))
      bad.push(`${hub} → ${href}`);
  }
}
check(
  "hubs don't link to noindex combinations",
  bad.length === 0,
  bad.slice(0, 5).join(" | "),
);

// --- empty combination: reachable, noindex, not in the sitemap ---------------------------
const empty = `${SITE}/nutricionista-zabljak`;
const emptyPage = await get(empty);
check(
  "empty combination is noindex and not in the sitemap",
  !inSitemap.has(norm(empty)) &&
    (emptyPage.res.status === 404 || /content="noindex/.test(emptyPage.text)),
  String(emptyPage.res.status),
);

// --- FAQ answers are in the raw HTML --------------------------------------------------
const home = await get(`${SITE}/`);
const faqJson = home.text.match(
  /"acceptedAnswer":\{"@type":"Answer","text":"([^"]{20,80})/,
);
check(
  "home FAQ answer text is in the server HTML (not only in JSON-LD)",
  faqJson != null && home.text.split(faqJson[1]).length > 2,
);

// --- social images -----------------------------------------------------------------
for (const page of [
  "/",
  "/vodoinstalater-podgorica",
  "/en/plumber-podgorica",
  "/usluge/vodoinstalater",
  "/gradovi/budva",
  urls.find((u) => u.includes("/b/")),
  urls.find((u) => u.includes("/cijene/")),
]) {
  const { text } = await get(page.startsWith("http") ? page : `${SITE}${page}`);
  const og = attr(text, /<meta property="og:image" content="([^"]+)"/);
  const tw = attr(text, /<meta name="twitter:card" content="([^"]+)"/);
  let ok = false;
  let info = og ?? "no og:image";
  if (og) {
    const res = await fetch(local(og));
    const buf = Buffer.from(await res.arrayBuffer());
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    ok =
      res.headers.get("content-type") === "image/png" &&
      w === 1200 &&
      h === 630 &&
      tw === "summary_large_image";
    info = `${w}×${h}, ${Math.round(buf.length / 1024)} KB`;
  }
  check(`og:image for ${page.replace(SITE, "")}`, ok, info);
}

const logo = await fetch(`${BASE}/logo.png`);
check(
  "/logo.png for Organization schema",
  logo.status === 200 && logo.headers.get("content-type") === "image/png",
);

console.log(failures ? `\n${failures} FAILED` : "\nAll SEO checks passed");
process.exit(failures ? 1 : 0);
