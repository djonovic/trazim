// Adds municipalities/settlements from supabase/seed/data/cities.ts that the
// database doesn't have yet (existing rows are left alone). Safe to re-run.
//
//   pnpm db:cities

import { createClient } from "@supabase/supabase-js";
import { slugify } from "../src/lib/slug.ts";
import { municipalities, settlements } from "../supabase/seed/data/cities.ts";

process.loadEnvFile(".env.local");
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const [{ data: regions }, { data: existing }] = await Promise.all([
  db.from("regions").select("id, slug"),
  db.from("cities").select("id, slug"),
]);
if (!regions || !existing) throw new Error("Couldn't read regions/cities");
const idBySlug = new Map(existing.map((c) => [c.slug, c.id]));

let added = 0;
// Municipalities first so settlements can resolve their parent.
for (const c of [...municipalities, ...settlements]) {
  const slug = c.slug ?? slugify(c.me);
  if (idBySlug.has(slug)) continue;
  const parentId = c.parent ? idBySlug.get(c.parent) : null;
  if (c.parent && !parentId) throw new Error(`Unknown parent ${c.parent}`);
  const { data, error } = await db
    .from("cities")
    .insert({
      slug,
      name_me: c.me,
      name_en: c.en,
      name_ru: c.ru,
      name_locative_me: c.locative,
      region_id: regions.find((r) => r.slug === c.region)!.id,
      parent_city_id: parentId ?? null,
      lat: c.lat,
      lng: c.lng,
      population: c.population ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  idBySlug.set(slug, data.id);
  added++;
}
console.log(`Added ${added} cities (${idBySlug.size} total).`);

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const res = await fetch(`${site}/api/revalidate`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.REVALIDATE_SECRET}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ tags: ["taxonomy"] }),
}).catch(() => null);
console.log(
  res?.ok
    ? "Revalidated cached pages."
    : `Couldn't reach ${site}/api/revalidate.`,
);
