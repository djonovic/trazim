// E2E for sign-in → business wizard → panel edits → public profile.
// Creates a throwaway user + business in Supabase and deletes both at the end.
//
//   pnpm build && pnpm start -p 3100   # in another terminal
//   pnpm test:e2e                      # E2E_BASE_URL overrides http://localhost:3100
//
// Uses your local Chrome (CHROME_PATH overrides the macOS default).
import { mkdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import puppeteer from "puppeteer-core";

process.loadEnvFile(".env.local");

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const FIXTURES = new URL("./fixtures/", import.meta.url).pathname;
const SHOTS = new URL("./screenshots/", import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const email = `e2e+${Date.now()}@trazim.me`;
const password = `E2e-${crypto.randomUUID()}`;

let failures = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "✓" : "✗"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) failures++;
};

const { data: created, error: createError } = await admin.auth.admin.createUser(
  {
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "E2E Tester" },
  },
);
if (createError) throw createError;
const userId = created.user.id;

// Produce the exact cookies @supabase/ssr would set after signing in.
const jar = [];
const ssr = createServerClient(
  URL_,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    cookies: { getAll: () => [], setAll: (c) => jar.push(...c) },
  },
);
const { error: signInError } = await ssr.auth.signInWithPassword({
  email,
  password,
});
if (signInError) throw signInError;

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("  [pageerror]", e.message));
await page.setViewport({ width: 1280, height: 900 });

try {
  // Signed out: /panel redirects to /prijava.
  await page.goto(`${BASE}/panel`, { waitUntil: "networkidle0" });
  check(
    "signed-out /panel redirects to login",
    page.url().includes("/prijava?next=%2Fpanel"),
    page.url(),
  );
  check(
    "login page shows Google and Apple",
    await page.evaluate(
      () =>
        document.body.innerText.includes("Nastavi sa Google") &&
        document.body.innerText.includes("Nastavi sa Apple"),
    ),
  );
  await page.screenshot({ path: `${SHOTS}e2e-login.png` });

  await browser.setCookie(
    ...jar.map((c) => ({
      name: c.name,
      value: c.value,
      domain: "localhost",
      path: "/",
      sameSite: "Lax",
    })),
  );

  // Wizard.
  await page.goto(`${BASE}/panel/novi`, { waitUntil: "networkidle0" });
  await page.waitForSelector('input[placeholder="Pretraži usluge…"]');
  await page.type('input[placeholder="Pretraži usluge…"]', "vodoinst");
  await page.evaluate(() =>
    [...document.querySelectorAll("button[aria-pressed]")]
      .find((b) => b.innerText.startsWith("Vodoinstalater"))
      ?.click(),
  );
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((b) => b.innerText === "Dalje")
      ?.click(),
  );
  await page.waitForSelector("select");
  const budva = await page.evaluate(
    () =>
      [...document.querySelectorAll("option")].find(
        (o) => o.textContent === "Budva",
      )?.value,
  );
  await page.select("select", budva);
  await page.evaluate(() =>
    [...document.querySelectorAll("button[aria-pressed]")]
      .find((b) => b.innerText === "Kotor")
      ?.click(),
  );
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((b) => b.innerText === "Dalje")
      ?.click(),
  );
  await page.waitForSelector(
    'input[placeholder="Npr. Vodoinstalater Marković"]',
  );
  await page.type(
    'input[placeholder="Npr. Vodoinstalater Marković"]',
    "E2E Test Vodoinstalater",
  );
  await page.type('input[type="tel"]', "067 555 123");
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(
    `${FIXTURES}photo-1.png`,
    `${FIXTURES}photo-2.png`,
  );
  await page.screenshot({
    path: `${SHOTS}e2e-wizard-step3.png`,
    fullPage: true,
  });
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((b) => b.innerText === "Objavi profil")
      ?.click(),
  );
  await page.waitForFunction(
    () =>
      location.pathname.startsWith("/panel/") &&
      location.search.includes("created=1"),
    { timeout: 30000 },
  );
  check("wizard creates business and opens editor", true, page.url());
  const businessId = page.url().split("/panel/")[1].split("?")[0];

  const { data: biz } = await admin
    .from("businesses")
    .select(
      "slug, phone, viber, whatsapp, city_id, business_services(service_id), business_cities(city_id), business_photos(storage_path, is_cover)",
    )
    .eq("id", businessId)
    .single();
  check(
    "phone normalized, Viber/WhatsApp same",
    biz.phone === "+38267555123" &&
      biz.viber === biz.phone &&
      biz.whatsapp === biz.phone,
    biz.phone,
  );
  check(
    "service area: Budva + Kotor",
    biz.business_cities.length === 2,
    JSON.stringify(biz.business_cities),
  );
  check(
    "2 photos uploaded as WebP, first is cover",
    biz.business_photos.length === 2 &&
      biz.business_photos.some((p) => p.is_cover) &&
      biz.business_photos.every((p) => p.storage_path.endsWith(".webp")),
  );
  check(
    "slug from name + city",
    biz.slug === "e2e-test-vodoinstalater-budva",
    biz.slug,
  );

  // Hours tab.
  await page.evaluate(() =>
    [...document.querySelectorAll('[role="tab"]')]
      .find((b) => b.innerText === "Radno vrijeme")
      ?.click(),
  );
  // New business: every day starts as "closed"; open Monday, then copy it to weekdays.
  await page.evaluate(() =>
    document.querySelector('li input[type="checkbox"]')?.click(),
  );
  await page.waitForSelector('input[type="time"]');
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((b) => b.innerText.startsWith("Kopiraj"))
      ?.click(),
  );
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((b) => b.innerText === "Sačuvaj izmjene")
      ?.click(),
  );
  await page.waitForFunction(
    () => document.body.innerText.includes("Sačuvano"),
    { timeout: 15000 },
  );
  const { data: hours } = await admin
    .from("business_hours")
    .select("weekday")
    .eq("business_id", businessId);
  check("hours saved (Mon–Fri)", hours.length === 5, `${hours.length} rows`);

  // Price tab.
  await page.evaluate(() =>
    [...document.querySelectorAll('[role="tab"]')]
      .find((b) => b.innerText === "Cjenovnik")
      ?.click(),
  );
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((b) => b.innerText === "Dodaj stavku")
      ?.click(),
  );
  await page.waitForSelector("li input");
  const inputs = await page.$$("li input");
  await inputs[0].type("Izlazak na teren");
  await inputs[1].type("20");
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((b) => b.innerText === "Sačuvaj izmjene")
      ?.click(),
  );
  await page.waitForFunction(
    () => document.body.innerText.includes("Sačuvano"),
    { timeout: 15000 },
  );
  const { data: prices } = await admin
    .from("price_list_items")
    .select("name, price_from")
    .eq("business_id", businessId);
  check(
    "price list saved",
    prices.length === 1 && Number(prices[0].price_from) === 20,
    JSON.stringify(prices),
  );
  await page.screenshot({
    path: `${SHOTS}e2e-editor-prices.png`,
    fullPage: true,
  });

  // Panel list and public profile.
  await page.goto(`${BASE}/panel`, { waitUntil: "networkidle0" });
  check(
    "panel lists the business",
    await page.evaluate(() =>
      document.body.innerText.includes("E2E Test Vodoinstalater"),
    ),
  );
  await page.screenshot({ path: `${SHOTS}e2e-panel.png`, fullPage: true });
  await page.goto(`${BASE}/b/${biz.slug}`, { waitUntil: "networkidle0" });
  const profileText = await page.evaluate(() => document.body.innerText);
  check(
    "public profile renders with price and 'Na provjeri'",
    profileText.includes("Izlazak na teren") &&
      profileText.includes("Na provjeri"),
  );
  check(
    "header shows user menu, not login",
    await page.evaluate(
      () => !!document.querySelector('button[aria-haspopup="menu"]'),
    ),
  );

  // Another user's panel URL must not open this business.
  const other = await admin.auth.admin.createUser({
    email: `e2e+other${Date.now()}@trazim.me`,
    password,
    email_confirm: true,
  });
  const jar2 = [];
  const ssr2 = createServerClient(
    URL_,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll: () => [], setAll: (c) => jar2.push(...c) } },
  );
  await ssr2.auth.signInWithPassword({
    email: other.data.user.email,
    password,
  });
  await browser.setCookie(
    ...jar.map((c) => ({
      name: c.name,
      value: "",
      domain: "localhost",
      path: "/",
      expires: 1,
    })),
  );
  const cookies2 = jar2.filter((c) => c.value);
  await browser.setCookie(
    ...cookies2.map((c) => ({
      name: c.name,
      value: c.value,
      domain: "localhost",
      path: "/",
    })),
  );
  await page.goto(`${BASE}/panel/${businessId}`, { waitUntil: "networkidle0" });
  check(
    "other user can't open the editor",
    await page.evaluate(() =>
      document.body.innerText.includes("nemaš pristup"),
    ),
  );
  await admin.auth.admin.deleteUser(other.data.user.id);

  // Signout.
  await browser.setCookie(
    ...jar2
      .filter((c) => c.value)
      .map((c) => ({
        name: c.name,
        value: "",
        domain: "localhost",
        path: "/",
        expires: 1,
      })),
  );
} finally {
  // Cleanup: business (+ storage) and user.
  const { data: mine } = await admin
    .from("businesses")
    .select("id")
    .eq("owner_id", userId);
  for (const { id } of mine ?? []) {
    const { data: files } = await admin.storage
      .from("business-photos")
      .list(id);
    if (files?.length)
      await admin.storage
        .from("business-photos")
        .remove(files.map((f) => `${id}/${f.name}`));
    await admin.from("businesses").delete().eq("id", id);
  }
  await admin.auth.admin.deleteUser(userId);
  // Drop cached listings/coverage so the deleted business disappears.
  await fetch(`${BASE}/api/revalidate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
  }).catch(() => {});
  await browser.close();
  console.log("Test data cleaned up");
}

console.log(failures ? `\n${failures} FAILED` : "\nAll E2E checks passed");
process.exit(failures ? 1 : 0);
