// Demo businesses, reviews and sponsorships for developing the public pages.
// Everything is tagged so it can be removed before launch:
//   businesses: slug starts with "demo-"
//   users:      email demo+N@trazim.me
//
//   pnpm db:demo                 # insert (idempotent: removes old demo data first)
//   pnpm db:demo --photos <dir>  # also upload p1-1.png … p6-3.png as photos of the first 6
//   pnpm db:demo --remove        # remove only

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  },
);

type Price = [
  name: string,
  kind: "fixed" | "from" | "range" | "on_request" | "free",
  from: number | null,
  to: number | null,
  unit: string,
];
type Demo = {
  slug: string;
  name: string;
  services: string[];
  city: string;
  area?: string[];
  description: string;
  prices?: Price[];
  hours?: "workdays" | "long" | "salon" | "none";
  verified?: boolean;
  online?: boolean;
  emergency?: boolean;
  response?: "minutes" | "hour" | "hours" | "day";
  address?: string;
  languages?: string[];
  sponsored?: boolean;
};

const demos: Demo[] = [
  {
    slug: "demo-vodoinstalater-markovic",
    name: "Vodoinstalater Marković",
    services: ["vodoinstalater", "renoviranje-kupatila"],
    city: "podgorica",
    area: ["zeta", "danilovgrad", "tuzi"],
    description:
      "Popravke, odgušenja i ugradnja sanitarija. Izlazak na teren isti dan, radimo i vikendom.",
    prices: [
      ["Izlazak na teren", "fixed", 15, null, "job"],
      ["Odgušenje odvoda", "from", 30, null, "job"],
      ["Zamjena bojlera", "range", 40, 70, "job"],
      ["Procjena radova", "free", null, null, "job"],
    ],
    hours: "long",
    verified: true,
    emergency: true,
    response: "minutes",
    sponsored: true,
  },
  {
    slug: "demo-hidro-servis-pg",
    name: "Hidro Servis PG",
    services: ["vodoinstalater", "grijanje"],
    city: "podgorica",
    description:
      "Vodoinstalaterski radovi i servis grijanja za stanove i poslovne prostore.",
    prices: [
      ["Izlazak na teren", "fixed", 20, null, "job"],
      ["Servis kotla", "fixed", 45, null, "job"],
    ],
    hours: "workdays",
    response: "hour",
  },
  {
    slug: "demo-aqua-majstor",
    name: "Aqua Majstor",
    services: ["vodoinstalater"],
    city: "podgorica",
    description:
      "Brze intervencije: curenja, slavine, WC kotlići. Dolazim za sat vremena.",
    prices: [["Zamjena slavine", "fixed", 25, null, "piece"]],
    hours: "long",
    response: "hour",
  },
  {
    slug: "demo-elektro-vukovic",
    name: "Elektro Vuković",
    services: ["elektricar", "video-nadzor"],
    city: "podgorica",
    area: ["danilovgrad"],
    description:
      "Elektroinstalacije, razvodne table, rasvjeta i video nadzor. Atest instalacija.",
    prices: [
      ["Montaža rasvjete", "from", 20, null, "piece"],
      ["Zamjena utičnice", "fixed", 10, null, "piece"],
      ["Nova razvodna tabla", "range", 150, 400, "job"],
    ],
    hours: "workdays",
    verified: true,
    response: "hour",
  },
  {
    slug: "demo-struja-plus",
    name: "Struja Plus",
    services: ["elektricar"],
    city: "podgorica",
    description: "Hitne intervencije na elektroinstalacijama 0-24.",
    prices: [["Izlazak na teren", "fixed", 20, null, "job"]],
    hours: "none",
    emergency: true,
    response: "minutes",
  },
  {
    slug: "demo-klima-centar-budva",
    name: "Klima Centar Budva",
    services: ["servis-klima", "elektricar"],
    city: "budva",
    area: ["becici", "petrovac", "kotor", "tivat"],
    description:
      "Servis, čišćenje i montaža klima uređaja. Pripremite apartmane za sezonu na vrijeme.",
    prices: [
      ["Čišćenje i dezinfekcija klime", "fixed", 35, null, "piece"],
      ["Montaža klime", "from", 120, null, "piece"],
      ["Dopuna freona", "range", 40, 70, "piece"],
    ],
    hours: "workdays",
    verified: true,
    response: "hour",
    languages: ["sr-Latn-ME", "en", "ru"],
    sponsored: true,
  },
  {
    slug: "demo-frigo-servis-bar",
    name: "Frigo Servis Bar",
    services: ["servis-klima", "servis-bijele-tehnike"],
    city: "bar",
    area: ["sutomore", "ulcinj"],
    description: "Popravka frižidera, veš mašina i klima uređaja.",
    prices: [["Dijagnostika", "fixed", 15, null, "job"]],
    hours: "workdays",
    response: "hours",
  },
  {
    slug: "demo-cisto-more",
    name: "Čisto More",
    services: ["ciscenje-apartmana", "ciscenje", "pranje-posteljine"],
    city: "budva",
    area: ["becici", "rafailovici", "sveti-stefan", "petrovac"],
    description:
      "Čišćenje apartmana između gostiju, pranje i peglanje posteljine. Radimo sa Airbnb i Booking domaćinima.",
    prices: [
      ["Čišćenje apartmana do 50 m²", "fixed", 30, null, "job"],
      ["Generalno čišćenje", "from", 3, null, "m2"],
      ["Posteljina (set)", "fixed", 6, null, "piece"],
    ],
    hours: "long",
    verified: true,
    response: "minutes",
    languages: ["sr-Latn-ME", "en", "ru"],
  },
  {
    slug: "demo-boka-clean",
    name: "Boka Clean",
    services: ["ciscenje-apartmana", "ciscenje", "ciscenje-plovila"],
    city: "kotor",
    area: ["tivat", "herceg-novi", "dobrota", "prcanj", "perast"],
    description: "Čišćenje apartmana, kuća i plovila u Boki Kotorskoj.",
    prices: [
      ["Čišćenje po satu", "fixed", 10, null, "hour"],
      ["Čišćenje jahte", "on_request", null, null, "job"],
    ],
    hours: "long",
    response: "hour",
    languages: ["sr-Latn-ME", "en"],
  },
  {
    slug: "demo-sjaj-pg",
    name: "Sjaj PG",
    services: ["ciscenje", "dubinsko-pranje-namjestaja", "pranje-tepiha"],
    city: "podgorica",
    description:
      "Čišćenje stanova i poslovnih prostora, dubinsko pranje namještaja i tepiha.",
    prices: [
      ["Čišćenje po satu", "fixed", 8, null, "hour"],
      ["Dubinsko pranje trosjeda", "fixed", 35, null, "piece"],
      ["Pranje tepiha", "fixed", 3, null, "m2"],
    ],
    hours: "workdays",
    response: "hours",
  },
  {
    slug: "demo-moler-jovanovic",
    name: "Moler Jovanović",
    services: ["moler", "gipsani-radovi"],
    city: "niksic",
    area: ["podgorica", "danilovgrad"],
    description: "Krečenje, gletovanje i gipsani radovi. Besplatna procjena.",
    prices: [
      ["Krečenje", "from", 3, null, "m2"],
      ["Gletovanje", "fixed", 5, null, "m2"],
    ],
    hours: "workdays",
    verified: true,
    response: "day",
  },
  {
    slug: "demo-keramika-nikolic",
    name: "Keramika Nikolić",
    services: ["keramicar", "renoviranje-kupatila"],
    city: "podgorica",
    description:
      "Postavljanje pločica, renoviranje kupatila po sistemu ključ u ruke.",
    prices: [
      ["Postavljanje pločica", "range", 12, 18, "m2"],
      ["Renoviranje kupatila", "on_request", null, null, "job"],
    ],
    hours: "workdays",
    response: "day",
  },
  {
    slug: "demo-kucni-majstor-hn",
    name: "Kućni Majstor HN",
    services: ["kucni-majstor", "montaza-namjestaja"],
    city: "herceg-novi",
    area: ["igalo", "bijela"],
    description:
      "Sitne popravke, montaža namještaja, bušenje i kačenje. Brzo i uredno.",
    prices: [
      ["Radni sat", "fixed", 15, null, "hour"],
      ["Montaža ormara", "from", 25, null, "piece"],
    ],
    hours: "workdays",
    response: "hour",
    languages: ["sr-Latn-ME", "ru"],
  },
  {
    slug: "demo-majstor-na-sat",
    name: "Majstor na sat",
    services: ["kucni-majstor"],
    city: "podgorica",
    description: "Sve sitne popravke u stanu na jednom mjestu.",
    prices: [["Radni sat", "fixed", 12, null, "hour"]],
    hours: "long",
    response: "minutes",
  },
  {
    slug: "demo-selidbe-brzo",
    name: "Selidbe Brzo",
    services: ["selidbe", "prevoz", "odvoz-suta-i-otpada"],
    city: "podgorica",
    area: ["niksic", "bar", "budva", "cetinje"],
    description:
      "Selidbe stanova i kancelarija širom Crne Gore. Kombi i kamion, radnici za nošenje.",
    prices: [
      ["Selidba unutar grada", "from", 60, null, "job"],
      ["Odvoz šuta", "from", 40, null, "job"],
    ],
    hours: "long",
    verified: true,
    response: "hour",
  },
  {
    slug: "demo-english-with-ana",
    name: "English with Ana",
    services: ["casovi-engleskog-jezika"],
    city: "podgorica",
    description:
      "Časovi engleskog za djecu i odrasle, priprema za IELTS i Cambridge ispite. Uživo i online.",
    prices: [
      ["Individualni čas 60 min", "fixed", 15, null, "session"],
      ["Probni čas", "free", null, null, "session"],
    ],
    hours: "workdays",
    online: true,
    response: "hours",
  },
  {
    slug: "demo-matematika-plus",
    name: "Matematika Plus",
    services: ["casovi-matematike", "casovi-fizike"],
    city: "niksic",
    description:
      "Pripreme za prijemni, maturu i kontrolne. Iskusan profesor matematike.",
    prices: [["Čas 60 min", "fixed", 12, null, "session"]],
    hours: "workdays",
    online: true,
    response: "day",
  },
  {
    slug: "demo-psiholog-milena",
    name: "Psiholog Milena Radović",
    services: ["psiholog", "psihoterapeut"],
    city: "podgorica",
    description:
      "Individualno savjetovanje i psihoterapija (KBT). Rad sa anksioznošću, stresom i odnosima.",
    prices: [
      ["Seansa 50 min", "fixed", 40, null, "session"],
      ["Online seansa", "fixed", 35, null, "session"],
    ],
    hours: "workdays",
    online: true,
    verified: true,
    response: "day",
    languages: ["sr-Latn-ME", "en"],
  },
  {
    slug: "demo-studio-lena",
    name: "Studio Lena",
    services: ["frizer", "manikir-i-pedikir", "sminker"],
    city: "budva",
    description:
      "Frizerski i kozmetički salon u centru Budve. Šminka i frizure za vjenčanja.",
    prices: [
      ["Žensko šišanje", "from", 15, null, "job"],
      ["Manikir", "fixed", 15, null, "session"],
      ["Svadbena šminka", "fixed", 60, null, "job"],
    ],
    hours: "salon",
    response: "hour",
    address: "Mediteranska bb",
    languages: ["sr-Latn-ME", "en", "ru"],
  },
  {
    slug: "demo-berbernica-kralj",
    name: "Berbernica Kralj",
    services: ["berberin"],
    city: "podgorica",
    description: "Muško šišanje i uređivanje brade.",
    prices: [
      ["Muško šišanje", "fixed", 8, null, "job"],
      ["Brada", "fixed", 5, null, "job"],
    ],
    hours: "salon",
    response: "hours",
    address: "Hercegovačka 12",
  },
  {
    slug: "demo-masaza-relax",
    name: "Relax masaža",
    services: ["masaza"],
    city: "kotor",
    area: ["tivat", "budva"],
    description: "Relaks i sportska masaža, dolazak na adresu.",
    prices: [["Masaža 60 min", "fixed", 35, null, "session"]],
    hours: "salon",
    response: "hours",
    languages: ["sr-Latn-ME", "en", "ru"],
  },
  {
    slug: "demo-auto-servis-niksic",
    name: "Auto Servis Nikšić",
    services: ["automehanicar", "autoelektricar"],
    city: "niksic",
    description: "Mali i veliki servis, dijagnostika, kočnice i trap.",
    prices: [
      ["Mali servis", "from", 40, null, "job"],
      ["Dijagnostika", "fixed", 20, null, "job"],
    ],
    hours: "workdays",
    response: "day",
  },
  {
    slug: "demo-foto-tijana",
    name: "Foto Tijana",
    services: ["fotograf", "snimanje-videa"],
    city: "tivat",
    area: ["kotor", "budva", "herceg-novi"],
    description: "Fotografisanje vjenčanja, porodica i nekretnina na primorju.",
    prices: [
      ["Vjenčanje", "from", 400, null, "job"],
      ["Fotografisanje apartmana", "fixed", 80, null, "job"],
    ],
    hours: "none",
    response: "hours",
    languages: ["sr-Latn-ME", "en"],
  },
  {
    slug: "demo-bazeni-primorje",
    name: "Bazeni Primorje",
    services: ["odrzavanje-bazena"],
    city: "budva",
    area: ["kotor", "tivat", "bar", "herceg-novi"],
    description: "Održavanje bazena za vile i apartmane tokom sezone.",
    prices: [["Mjesečno održavanje", "from", 120, null, "month"]],
    hours: "workdays",
    response: "day",
    languages: ["sr-Latn-ME", "en", "ru"],
  },
  {
    slug: "demo-upravljanje-adria",
    name: "Adria Property Care",
    services: ["upravljanje-apartmanima", "ciscenje-apartmana"],
    city: "tivat",
    area: ["kotor", "budva", "radovici"],
    description:
      "Upravljanje apartmanima: prijem gostiju, čišćenje, održavanje i oglasi na Airbnb i Booking.",
    prices: [["Upravljanje", "on_request", null, null, "month"]],
    hours: "workdays",
    verified: true,
    response: "minutes",
    languages: ["sr-Latn-ME", "en", "ru"],
  },
];

const users = [
  "Marko Petrović",
  "Ana Kovačević",
  "Nikola Đurović",
  "Jelena Popović",
  "Ivan Radulović",
  "Sara Bošković",
];
const reviewTexts = [
  [5, "Došao isti dan, sve završio brzo i uredno. Preporuka!"],
  [5, "Korektan dogovor, cijena kao što je rečeno. Sigurno ću opet zvati."],
  [4, "Dobar posao, malo je kasnio ali je javio unaprijed."],
  [5, "Profesionalno i ljubazno. Sve pohvale."],
  [4, "Zadovoljni smo, cijena je realna."],
  [5, "Najbolji u gradu, bez dileme."],
] as const;

const HOURS: Record<NonNullable<Demo["hours"]>, [number, string, string][]> = {
  workdays: [1, 2, 3, 4, 5]
    .map((d) => [d, "08:00", "16:00"] as [number, string, string])
    .concat([[6, "09:00", "13:00"]]),
  long: [1, 2, 3, 4, 5, 6]
    .map((d) => [d, "07:00", "21:00"] as [number, string, string])
    .concat([[7, "09:00", "15:00"]]),
  salon: [1, 2, 3, 4, 5]
    .map((d) => [d, "09:00", "20:00"] as [number, string, string])
    .concat([[6, "09:00", "15:00"]]),
  none: [],
};

async function must<T>(
  p: PromiseLike<{ data: T; error: { message: string } | null }>,
) {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return data as NonNullable<T>;
}

async function remove() {
  const existing = await must(
    db.from("businesses").select("id").like("slug", "demo-%"),
  );
  for (const { id } of existing) {
    const { data: files } = await db.storage.from("business-photos").list(id);
    if (files?.length)
      await db.storage
        .from("business-photos")
        .remove(files.map((f) => `${id}/${f.name}`));
  }
  await must(db.from("businesses").delete().like("slug", "demo-%"));
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  for (const u of data.users.filter((u) =>
    /^demo\+\d+@trazim\.me$/.test(u.email ?? ""),
  )) {
    await db.auth.admin.deleteUser(u.id);
  }
  console.log("Removed demo data");
}

async function insert() {
  const [services, cities] = await Promise.all([
    must(db.from("services").select("id, slug_me")),
    must(db.from("cities").select("id, slug")),
  ]);
  const serviceId = (slug: string) => {
    const s = services.find((x) => x.slug_me === slug);
    if (!s) throw new Error(`Unknown service ${slug}`);
    return s.id;
  };
  const cityId = (slug: string) => {
    const c = cities.find((x) => x.slug === slug);
    if (!c) throw new Error(`Unknown city ${slug}`);
    return c.id;
  };

  const userIds: string[] = [];
  for (const [i, name] of users.entries()) {
    const { data, error } = await db.auth.admin.createUser({
      email: `demo+${i + 1}@trazim.me`,
      email_confirm: true,
      user_metadata: { full_name: name },
    });
    if (error) throw new Error(error.message);
    userIds.push(data.user.id);
  }

  for (const [i, d] of demos.entries()) {
    const createdDaysAgo = i % 7 === 0 ? 5 : 40 + i * 9;
    const [row] = await must(
      db
        .from("businesses")
        .insert({
          slug: d.slug,
          name: d.name,
          description: d.description,
          phone: `+38267${String(100000 + i * 7919).slice(-6)}`,
          email: `${d.slug.replace(/^demo-/, "")}@example.com`,
          city_id: cityId(d.city),
          address: d.address ?? null,
          status: "active",
          moderated_at: new Date().toISOString(),
          verified_at: d.verified ? new Date().toISOString() : null,
          offers_online: d.online ?? false,
          emergency_24h: d.emergency ?? false,
          response_time_bucket: d.response ?? null,
          languages: d.languages ?? ["sr-Latn-ME"],
          views_count: 30 + ((i * 137) % 900),
          created_at: new Date(
            Date.now() - createdDaysAgo * 86400_000,
          ).toISOString(),
        })
        .select("id"),
    );
    const id = row.id;

    await must(
      db.from("business_services").insert(
        d.services.map((s, j) => ({
          business_id: id,
          service_id: serviceId(s),
          is_primary: j === 0,
        })),
      ),
    );
    if (d.area?.length) {
      await must(
        db
          .from("business_cities")
          .insert(d.area.map((c) => ({ business_id: id, city_id: cityId(c) }))),
      );
    }
    const hours = HOURS[d.hours ?? "workdays"];
    if (hours.length) {
      await must(
        db.from("business_hours").insert(
          hours.map(([weekday, opens_at, closes_at]) => ({
            business_id: id,
            weekday,
            opens_at,
            closes_at,
          })),
        ),
      );
    }
    if (d.prices?.length) {
      await must(
        db.from("price_list_items").insert(
          d.prices.map(([name, kind, from, to, unit], j) => ({
            business_id: id,
            service_id: serviceId(d.services[0]),
            name,
            kind,
            price_from: from,
            price_to: to,
            unit: unit as "job",
            sort_order: j,
          })),
        ),
      );
    }
    // 0–4 reviews per business, from different demo users.
    const reviewCount = (i * 3) % 5;
    if (reviewCount) {
      await must(
        db.from("reviews").insert(
          Array.from({ length: reviewCount }, (_, j) => {
            const [rating, body] = reviewTexts[(i + j) % reviewTexts.length];
            return {
              business_id: id,
              user_id: userIds[(i + j) % userIds.length],
              rating,
              body,
              created_at: new Date(
                Date.now() - (j * 11 + i) * 3600_000 * 5,
              ).toISOString(),
            };
          }),
        ),
      );
    }
    if (d.sponsored) {
      await must(
        db.from("sponsorships").insert({
          business_id: id,
          scope: "service_city",
          service_id: serviceId(d.services[0]),
          city_id: cityId(d.city),
          ends_at: new Date(Date.now() + 30 * 86400_000).toISOString(),
          payment_ref: "demo",
        }),
      );
      await must(
        db.from("sponsorships").insert({
          business_id: id,
          scope: "home",
          ends_at: new Date(Date.now() + 30 * 86400_000).toISOString(),
          payment_ref: "demo",
        }),
      );
    }
  }

  const photosDir = process.argv[process.argv.indexOf("--photos") + 1];
  if (process.argv.includes("--photos") && photosDir) {
    const files = readdirSync(photosDir)
      .filter((f) => /^p\d+-\d+\.png$/.test(f))
      .sort();
    const ids = await must(
      db.from("businesses").select("id, slug").like("slug", "demo-%"),
    );
    for (const file of files) {
      const [, n, v] = file.match(/^p(\d+)-(\d+)\.png$/)!;
      const business = ids.find((b) => b.slug === demos[Number(n) - 1]?.slug);
      if (!business) continue;
      const path = `${business.id}/${file}`;
      const { error } = await db.storage
        .from("business-photos")
        .upload(path, readFileSync(join(photosDir, file)), {
          contentType: "image/png",
          upsert: true,
        });
      if (error) throw new Error(error.message);
      await must(
        db.from("business_photos").insert({
          business_id: business.id,
          storage_path: path,
          is_cover: v === "1",
          sort_order: Number(v),
        }),
      );
    }
    console.log(`Uploaded ${files.length} demo photos`);
  }

  await must(db.rpc("refresh_price_stats"));
  console.log(
    `Inserted ${demos.length} demo businesses and ${users.length} demo users`,
  );
}

/** Drop cached pages' data on a running app (dev server or deployed site). */
async function revalidate() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
    });
    console.log(
      res.ok
        ? `Revalidated cache at ${url}`
        : `Cache revalidation failed: ${res.status}`,
    );
  } catch {
    console.log(`No app running at ${url}; cache not revalidated`);
  }
}

await remove();
if (!process.argv.includes("--remove")) await insert();
await revalidate();
