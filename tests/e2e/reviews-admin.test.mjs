// E2E for reviews (deferred sign-in), reports, owner replies and the admin area.
// Creates throwaway users + a business in Supabase and deletes them at the end.
//
//   pnpm build && pnpm start -p 3100   # in another terminal
//   node tests/e2e/reviews-admin.test.mjs
import { mkdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import puppeteer from "puppeteer-core";

process.loadEnvFile(".env.local");

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const SHOTS = new URL("./screenshots/", import.meta.url).pathname;
const FIXTURES = new URL("./fixtures/", import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const db = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const stamp = Date.now();
const password = `E2e-${crypto.randomUUID()}`;

let failures = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "✓" : "✗"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) failures++;
};

async function makeUser(tag, meta = {}) {
  const { data, error } = await db.auth.admin.createUser({
    email: `e2e+${tag}${stamp}@trazim.me`,
    password,
    email_confirm: true,
    user_metadata: meta,
  });
  if (error) throw error;
  return data.user;
}

/** The cookies @supabase/ssr would set after signing in. */
async function sessionCookies(user) {
  const jar = [];
  const ssr = createServerClient(
    URL_,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { getAll: () => [], setAll: (c) => jar.push(...c) },
    },
  );
  const { error } = await ssr.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (error) throw error;
  return jar.filter((c) => c.value);
}

const owner = await makeUser("owner", { full_name: "E2E Vlasnik" });
const reviewer = await makeUser("reviewer"); // no name: the form asks for it
const adminUser = await makeUser("admin", { full_name: "E2E Admin" });
await db.from("profiles").update({ role: "admin" }).eq("id", adminUser.id);

const { data: city } = await db
  .from("cities")
  .select("id")
  .eq("slug", "podgorica")
  .single();
const { data: service } = await db
  .from("services")
  .select("id, slug_me")
  .eq("slug_me", "vodoinstalater")
  .single();
const slug = `e2e-recenzije-${stamp}`;
const { data: biz, error: bizError } = await db
  .from("businesses")
  .insert({
    owner_id: owner.id,
    slug,
    name: `E2E Recenzije ${stamp}`,
    phone: "+38267000111",
    city_id: city.id,
  })
  .select("id")
  .single();
if (bizError) throw bizError;
await db
  .from("business_services")
  .insert({ business_id: biz.id, service_id: service.id, is_primary: true });

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("  [pageerror]", e.message));
page.on("dialog", (d) => d.accept()); // window.confirm in admin actions
await page.setViewport({ width: 1280, height: 900 });

let current = [];
async function signInAs(user) {
  // deleteCookie needs the value; expiring the cookies is simpler.
  if (current.length)
    await browser.setCookie(
      ...current.map((c) => ({
        name: c.name,
        value: "",
        domain: "localhost",
        path: "/",
        expires: 1,
      })),
    );
  current = user ? await sessionCookies(user) : [];
  if (current.length)
    await browser.setCookie(
      ...current.map((c) => ({
        name: c.name,
        value: c.value,
        domain: "localhost",
        path: "/",
        sameSite: "Lax",
      })),
    );
}

// Waits for the load event and for the header's user menu to hydrate (the
// session is known), not for network idle: in this flow Chrome keeps
// connections open and networkidle never fires, though every request finishes.
async function visit(url) {
  const response = await page.goto(url, { waitUntil: "load" });
  await page.waitForFunction(
    () =>
      document.querySelector('header button[aria-haspopup="menu"]') ||
      [...document.querySelectorAll("header button")].some(
        (b) => b.innerText.trim() === "Prijava",
      ),
    { timeout: 15000 },
  );
  return response;
}
const text = () => page.evaluate(() => document.body.innerText);
const clickText = (selector, label) =>
  page.evaluate(
    (selector, label) => {
      const el = [...document.querySelectorAll(selector)].find((e) =>
        e.innerText.trim().startsWith(label),
      );
      el?.click();
      return Boolean(el);
    },
    selector,
    label,
  );
const waitText = (value, timeout = 15000) =>
  page.waitForFunction(
    (v) => document.body.innerText.includes(v),
    { timeout },
    value,
  );
const profile = `${BASE}/b/${slug}`;

try {
  // 1. Anonymous visitor writes a review; sign-in is asked only on submit.
  await visit(profile);
  await clickText("button", "Ostavi recenziju");
  await page.waitForSelector('button[role="radio"]');
  await page.click('button[role="radio"][aria-label^="4 "]');
  await page.type("textarea", "Došao na vrijeme, sve riješio za sat.");
  await clickText("button", "Objavi recenziju");
  await waitText("Tvoja recenzija je spremna");
  check(
    "anonymous submit asks to sign in with 'Tvoja recenzija je spremna'",
    true,
  );
  const draft = await page.evaluate(
    (id) => localStorage.getItem(`trazim.review.${id}`),
    biz.id,
  );
  check("draft saved in localStorage", JSON.parse(draft ?? "{}").rating === 4);

  // 2. After signing in the draft reopens; name is asked because the profile has none.
  await signInAs(reviewer);
  await visit(profile);
  await waitText("Sačuvali smo tvoju recenziju");
  check("draft reopens after sign-in", true);
  await page.type('input[autocomplete="name"]', "Petar Testić");
  const reviewFiles = await page.$('[role="dialog"] input[type="file"]');
  await reviewFiles.uploadFile(
    `${FIXTURES}photo-1.png`,
    `${FIXTURES}photo-2.png`,
  );
  await page.waitForFunction(
    () => document.querySelectorAll('[role="dialog"] img').length >= 2,
  );
  await page.screenshot({ path: `${SHOTS}/review-dialog.png` });
  await clickText("button", "Objavi recenziju");
  await waitText("Hvala! Tvoja recenzija je objavljena.", 30000);
  const { data: review } = await db
    .from("reviews")
    .select("id, rating, body, edited_at")
    .eq("business_id", biz.id)
    .eq("user_id", reviewer.id)
    .single();
  const { data: reviewerProfile } = await db
    .from("profiles")
    .select("full_name")
    .eq("id", reviewer.id)
    .single();
  const { data: reviewPhotos } = await db
    .from("review_photos")
    .select("storage_path")
    .eq("review_id", review.id);
  check(
    "2 review photos uploaded as WebP",
    reviewPhotos.length === 2 &&
      reviewPhotos.every(
        (p) =>
          p.storage_path.startsWith(`${review.id}/`) &&
          p.storage_path.endsWith(".webp"),
      ),
  );
  check(
    "review saved with rating 4 and the reviewer's name",
    review.rating === 4 && reviewerProfile.full_name === "Petar Testić",
  );
  await visit(profile);
  check(
    "profile shows the review as 'Petar T.'",
    (await text()).includes("Petar T.") &&
      (await text()).includes("Došao na vrijeme"),
  );
  check(
    "draft cleared",
    !(await page.evaluate(
      (id) => localStorage.getItem(`trazim.review.${id}`),
      biz.id,
    )),
  );

  // 3. Editing the review.
  await waitText("Izmijeni svoju recenziju");
  await clickText("button", "Izmijeni svoju recenziju");
  await page.waitForSelector('button[role="radio"]');
  await page.click('button[role="radio"][aria-label^="5 "]');
  await clickText("button", "Sačuvaj izmjene");
  await waitText("Hvala! Tvoja recenzija je objavljena.");
  const { data: edited } = await db
    .from("reviews")
    .select("rating, edited_at")
    .eq("id", review.id)
    .single();
  check(
    "edit saves rating 5 and marks edited",
    edited.rating === 5 && edited.edited_at,
  );

  // 4. Reporting the business (twice: second is a no-op).
  await visit(profile);
  await clickText("button", "Prijavi problem");
  await page.waitForSelector('input[type="radio"][value="false_info"]');
  await page.click('input[type="radio"][value="false_info"]');
  await page.type('[role="dialog"] textarea', "Broj ne radi.");
  await clickText('[role="dialog"] button', "Pošalji prijavu");
  await waitText("Hvala! Pregledaćemo prijavu.");
  await page.keyboard.press("Escape");
  await clickText("button", "Prijavi problem");
  await page.waitForSelector('input[type="radio"][value="spam"]');
  await page.click('input[type="radio"][value="spam"]');
  await clickText('[role="dialog"] button', "Pošalji prijavu");
  await waitText("već poslata");
  const { data: reports } = await db
    .from("reports")
    .select("id, reason, status")
    .eq("business_id", biz.id);
  check(
    "one open report saved",
    reports.length === 1 && reports[0].reason === "false_info",
  );

  // 5. Owner replies from the panel and can't review their own business.
  await signInAs(owner);
  await visit(profile);
  await waitText("Ovo je tvoj biznis");
  check("owner sees 'Ovo je tvoj biznis' instead of the review button", true);
  await visit(`${BASE}/panel/${biz.id}`);
  await clickText('[role="tab"]', "Recenzije");
  await clickText("button", "Odgovori");
  await page.waitForSelector("textarea");
  await page.type("textarea", "Hvala Petre, vidimo se!");
  await clickText("button", "Objavi odgovor");
  await waitText("Tvoj odgovor");
  const { data: replied } = await db
    .from("reviews")
    .select("reply_body")
    .eq("id", review.id)
    .single();
  check("owner reply saved", replied.reply_body === "Hvala Petre, vidimo se!");
  await visit(profile);
  check(
    "reply shown on profile",
    (await text()).includes("Hvala Petre, vidimo se!"),
  );

  // 5b. Job request: written signed out, sent after signing in, seen by the
  // matching business in its panel, which opens the customer's phone.
  await signInAs(null);
  await visit(`${BASE}/${service.slug_me}-podgorica`);
  await clickText("button", "Pošalji upit");
  await page.waitForSelector('[role="dialog"] textarea');
  await page.type(
    '[role="dialog"] textarea',
    `E2E upit ${stamp}: curi bojler, treba zamjena ventila.`,
  );
  await page.type('[role="dialog"] input[type="tel"]', "069 123 456");
  await clickText('[role="dialog"] button', "Pošalji upit");
  await waitText("Tvoj upit je spreman");
  check("signed-out request asks to sign in ('Tvoj upit je spreman')", true);
  await signInAs(reviewer);
  await visit(`${BASE}/${service.slug_me}-podgorica`);
  await waitText("Sačuvali smo tvoj upit");
  await clickText('[role="dialog"] button', "Pošalji upit");
  await waitText("Upit je poslat");
  const { data: sentInquiry } = await db
    .from("inquiries")
    .select("id, phone, status, service_id, city_id")
    .eq("user_id", reviewer.id)
    .single();
  check(
    "request saved (approved, phone normalized)",
    sentInquiry.status === "approved" && sentInquiry.phone === "+38269123456",
  );
  await signInAs(owner);
  await visit(`${BASE}/panel/${biz.id}`);
  await clickText('[role="tab"]', "Upiti");
  await waitText(`E2E upit ${stamp}`);
  check("matching business sees the request in its panel", true);
  await clickText("button", "Prikaži kontakt");
  await waitText("+38269123456");
  const { data: opened } = await db
    .from("inquiry_reveals")
    .select("business_id")
    .eq("inquiry_id", sentInquiry.id);
  check(
    "opening the contact is counted",
    opened.length === 1 && opened[0].business_id === biz.id,
  );
  await page.screenshot({
    path: `${SHOTS}/panel-inquiries.png`,
    fullPage: true,
  });

  // 5c. Badge, QR and the public pages about ranking and prices.
  const badge = await fetch(`${BASE}/api/badge/${slug}`);
  const badgeSvg = await badge.text();
  check(
    "badge SVG with rating",
    badge.headers.get("content-type")?.startsWith("image/svg+xml") &&
      badgeSvg.includes("5.0"),
  );
  const qr = await fetch(`${BASE}/api/qr/${slug}`);
  check("QR code SVG", qr.status === 200 && (await qr.text()).includes("<svg"));
  const forBusiness = await (await fetch(`${BASE}/za-biznise`)).text();
  check(
    "/za-biznise shows the price list",
    forBusiness.includes("Paketi i cijene") &&
      forBusiness.includes("Vrh liste"),
  );
  const ranking = await fetch(`${BASE}/kako-rangiramo`);
  check(
    "/kako-rangiramo exists",
    ranking.status === 200 &&
      (await ranking.text()).includes("Sponzorisana mjesta"),
  );

  // 6. Admin area is a 404 for non-admins.
  const denied = await visit(`${BASE}/admin`);
  check(
    "non-admin gets 404 on /admin",
    denied.status() === 404,
    String(denied.status()),
  );

  // 7. Admin resolves the report, approves and verifies the profile.
  await signInAs(adminUser);
  await visit(`${BASE}/admin/prijave`);
  check("admin sees the report", (await text()).includes("Broj ne radi."));
  await page.screenshot({ path: `${SHOTS}/admin-reports.png`, fullPage: true });
  await clickText("button", "Riješeno");
  await page.waitForSelector("form textarea");
  await page.type("form textarea", "Vlasnik ažurirao broj.");
  await clickText("form button", "Riješeno");
  await page.waitForFunction(
    () => document.body.innerText.includes("Nema otvorenih prijava"),
    {
      timeout: 15000,
    },
  );
  const { data: resolved } = await db
    .from("reports")
    .select("status, resolved_by, resolution_note")
    .eq("id", reports[0].id)
    .single();
  check(
    "report resolved with note and admin",
    resolved.status === "resolved" &&
      resolved.resolved_by === adminUser.id &&
      resolved.resolution_note === "Vlasnik ažurirao broj.",
  );

  await visit(`${BASE}/admin/profili`);
  check(
    "pending list has the business",
    (await text()).includes(`E2E Recenzije ${stamp}`),
  );
  await visit(`${BASE}/admin/profili/${biz.id}`);
  check("admin sees the phone number", (await text()).includes("+38267000111"));
  await clickText("button", "Odobri");
  await page.waitForFunction(
    () => !document.body.innerText.includes("Na provjeri"),
    {
      timeout: 15000,
    },
  );
  await clickText("button", "Označi kao provjeren");
  await waitText("Skini „Provjeren”");
  await page.screenshot({
    path: `${SHOTS}/admin-business.png`,
    fullPage: true,
  });
  const { data: moderated } = await db
    .from("businesses")
    .select("moderated_at, verified_at")
    .eq("id", biz.id)
    .single();
  check(
    "approved and verified",
    moderated.moderated_at && moderated.verified_at,
  );
  // The cached page may be regenerated between approve and verify; the next
  // request serves the fresh one.
  await visit(profile);
  let publicText = await text();
  if (publicText.includes("Na provjeri") || !publicText.includes("Provjeren")) {
    await new Promise((r) => setTimeout(r, 1500));
    await visit(profile);
    publicText = await text();
  }
  check(
    "public profile: 'Provjeren', no 'Na provjeri'",
    publicText.includes("Provjeren") && !publicText.includes("Na provjeri"),
    `Provjeren=${publicText.includes("Provjeren")} NaProvjeri=${publicText.includes("Na provjeri")}`,
  );

  // 8. Admin hides the review; the rating drops.
  await visit(`${BASE}/admin/recenzije`);
  await page.evaluate((name) => {
    const card = [...document.querySelectorAll("li")].find((li) =>
      li.innerText.includes(name),
    );
    [...card.querySelectorAll("button")]
      .find((b) => b.innerText === "Sakrij")
      ?.click();
  }, `E2E Recenzije ${stamp}`);
  await new Promise((r) => setTimeout(r, 2500));
  const { data: hidden } = await db
    .from("reviews")
    .select("status, businesses(rating_count)")
    .eq("id", review.id)
    .single();
  check(
    "review hidden and rating recalculated",
    hidden.status === "hidden" && hidden.businesses.rating_count === 0,
  );
  const anonDb = createClient(URL_, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const { data: anonPhotos } = await anonDb
    .from("review_photos")
    .select("id")
    .eq("review_id", review.id);
  check("photos of a hidden review aren't public", anonPhotos.length === 0);

  // 9. Manual sponsorship shows up on the service + city listing.
  await visit(`${BASE}/admin/sponzorstva`);
  await page.type("#sp-business", `E2E Recenzije ${stamp}`);
  await page.waitForFunction(
    (name) =>
      [...document.querySelectorAll("form ul button")].some((b) =>
        b.innerText.includes(name),
      ),
    { timeout: 10000 },
    `E2E Recenzije ${stamp}`,
  );
  await clickText("form ul button", `E2E Recenzije ${stamp}`);
  // Three placements at once: service + city, the city page, and home.
  let selects = await page.$$("[data-placement] select");
  await selects[1].select(String(service.id));
  await selects[2].select(String(city.id));
  await clickText("button", "Dodaj poziciju");
  selects = await page.$$("[data-placement] select");
  await selects[3].select("city");
  selects = await page.$$("[data-placement] select");
  await selects[4].select(String(city.id));
  await clickText("button", "Početna");
  await clickText("button", "Dodaj sponzorstvo");
  await waitText(`Dodato: E2E Recenzije ${stamp} (3 pozicije)`);
  const { data: sponsorships } = await db
    .from("sponsorships")
    .select("scope, service_id, city_id, status")
    .eq("business_id", biz.id);
  const scopes = sponsorships.map((s) => s.scope).sort();
  check(
    "three placements saved (home, city, service_city)",
    scopes.join() === "city,home,service_city" &&
      sponsorships.every((s) => s.status === "active"),
    scopes.join(),
  );
  for (const [url, label] of [
    [`${BASE}/${service.slug_me}-podgorica`, "service + city listing"],
    [`${BASE}/gradovi/podgorica`, "city page"],
    [`${BASE}/`, "home page"],
  ]) {
    await visit(url);
    const html = await page.content();
    const at = html.indexOf("Sponzorisano");
    check(
      `${label} shows the business as sponsored`,
      at >= 0 && html.slice(at, at + 30000).includes(`E2E Recenzije ${stamp}`),
    );
  }

  // 10. Category banner: booked in admin, shown next to the service's
  // results, clicks counted; services without one invite advertisers.
  await visit(`${BASE}/admin/baneri`);
  // Placement defaults to "Usluga"; the second select is the service.
  const bannerSelects = await page.$$("form select");
  await bannerSelects[1].select(String(service.id));
  const bannerInputs = await page.$$(
    'form input:not([type="file"]):not([type="date"])',
  );
  await bannerInputs[0].type(`E2E Keramika ${stamp}`);
  await bannerInputs[1].type("Pločice na akciji");
  // The field starts with "https://"; replace it instead of appending.
  await page.$eval('form input[type="url"]', (el) => {
    el.focus();
    el.select();
  });
  await page.keyboard.type("https://example.com/e2e");
  await clickText("button", "Dodaj baner");
  await waitText(`Dodat baner: E2E Keramika ${stamp}`);
  const { data: bannerRow } = await db
    .from("banners")
    .select("id, clicks")
    .eq("advertiser", `E2E Keramika ${stamp}`)
    .single();
  check("banner saved", Boolean(bannerRow));
  const listingHtml = await (
    await fetch(`${BASE}/${service.slug_me}-podgorica`)
  ).text();
  check(
    "listing shows the banner",
    listingHtml.includes("Pločice na akciji") &&
      listingHtml.includes(`/r/banner/${bannerRow.id}`),
  );
  const click = await fetch(`${BASE}/r/banner/${bannerRow.id}`, {
    redirect: "manual",
  });
  const { data: afterClick } = await db
    .from("banners")
    .select("clicks")
    .eq("id", bannerRow.id)
    .single();
  check(
    "banner click redirects and is counted",
    click.status === 302 &&
      click.headers.get("location") === "https://example.com/e2e" &&
      afterClick.clicks === 1,
  );
  const emptyHtml = await (await fetch(`${BASE}/usluge/astrolog`)).text();
  check(
    "services without a banner invite advertisers",
    emptyHtml.includes("Tvoj brend ovdje") &&
      emptyHtml.includes("za-biznise#baneri"),
  );
  const homeHtml = await (await fetch(`${BASE}/`)).text();
  check(
    "home page has a banner spot",
    homeHtml.includes("Tvoj brend ovdje") && homeHtml.includes("sticky top-24"),
  );
  await db.from("banners").delete().eq("id", bannerRow.id);

  const { count } = await db
    .from("admin_actions")
    .select("id", { count: "exact", head: true })
    .eq("business_id", biz.id);
  check("admin actions logged", count >= 7, `${count} entries`);
} finally {
  await db.from("admin_actions").delete().eq("business_id", biz.id);
  const { data: files } = await db.storage
    .from("review-photos")
    .list("", { limit: 1000 });
  for (const folder of files ?? []) {
    const { data: inner } = await db.storage
      .from("review-photos")
      .list(folder.name);
    const { data: owned } = await db
      .from("reviews")
      .select("id")
      .eq("id", folder.name)
      .eq("business_id", biz.id);
    if (owned?.length && inner?.length)
      await db.storage
        .from("review-photos")
        .remove(inner.map((f) => `${folder.name}/${f.name}`));
  }
  await db.from("businesses").delete().eq("id", biz.id);
  for (const u of [owner, reviewer, adminUser])
    await db.auth.admin.deleteUser(u.id);
  await browser.close();
  // Drop the cached listing/profile so the deleted business disappears.
  await fetch(`${BASE}/api/revalidate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REVALIDATE_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags: ["businesses", "reviews", "sponsorships", "banners"],
    }),
  }).catch(() => {});
  console.log("Test data cleaned up");
}

console.log(
  failures ? `\n${failures} FAILED` : "\nAll review/admin E2E checks passed",
);
process.exit(failures ? 1 : 0);
