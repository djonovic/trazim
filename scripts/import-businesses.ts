// Imports researched businesses (their own public details, see
// docs/research/ and the source_urls column) from a JSON file:
//
//   pnpm db:import path/to/businesses.json
//
// Each item: name, services[] (slug_me, first = main), city, extra_cities[],
// phone, email, website, instagram, facebook, address, hours[],
// emergency_24h, languages[], description, sources[].
// Profiles are unclaimed (no owner) and published as reviewed.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { normalizePhone } from "../src/lib/business-input.ts";
import { slugify } from "../src/lib/slug.ts";

process.loadEnvFile(".env.local");
const file = process.argv[2];
if (!file) {
  console.error("Usage: pnpm db:import <file.json>");
  process.exit(1);
}
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

type Item = {
  name: string;
  services: string[];
  city: string;
  extra_cities?: string[];
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  address?: string | null;
  hours?: { weekday: number; opens: string; closes: string }[] | null;
  emergency_24h?: boolean;
  languages?: string[];
  description: string;
  sources: string[];
};

const items = JSON.parse(readFileSync(file, "utf8")) as Item[];
const [{ data: services }, { data: cities }, { data: taken }] =
  await Promise.all([
    db.from("services").select("id, slug_me"),
    db.from("cities").select("id, slug"),
    db.from("businesses").select("slug"),
  ]);
const serviceId = new Map(services!.map((s) => [s.slug_me, s.id]));
const cityId = new Map(cities!.map((c) => [c.slug, c.id]));
const slugs = new Set(taken!.map((b) => b.slug));

const problems: string[] = [];
for (const it of items) {
  for (const s of it.services)
    if (!serviceId.has(s)) problems.push(`${it.name}: unknown service ${s}`);
  for (const c of [it.city, ...(it.extra_cities ?? [])])
    if (!cityId.has(c)) problems.push(`${it.name}: unknown town ${c}`);
  if (!it.sources?.length) problems.push(`${it.name}: no sources`);
  if (it.phone && !normalizePhone(it.phone))
    problems.push(`${it.name}: bad phone ${it.phone}`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const now = new Date().toISOString();
let added = 0;
for (const it of items) {
  // Legal forms and bracketed extras don't belong in the URL.
  const cleanName = it.name
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(d\.?\s?o\.?\s?o\.?|doo|dooel|a\.?d\.?)(?=\s|$)/gi, " ")
    .trim();
  let base = slugify(cleanName).slice(0, 50).replace(/-+$/, "") || "biznis";
  if (!base.endsWith(it.city)) base = `${base}-${it.city}`;
  let slug = base;
  for (let i = 2; slugs.has(slug); i++) slug = `${base}-${i}`;
  slugs.add(slug);

  const phone = it.phone ? normalizePhone(it.phone) : null;
  const { data: biz, error } = await db
    .from("businesses")
    .insert({
      slug,
      name: it.name.trim(),
      description: it.description.trim(),
      phone,
      email: it.email?.trim() || null,
      website: it.website || it.facebook || null,
      instagram: it.instagram || null,
      address: it.address || null,
      city_id: cityId.get(it.city)!,
      emergency_24h: Boolean(it.emergency_24h),
      languages: it.languages?.length ? it.languages : ["sr-Latn-ME"],
      status: "active",
      moderated_at: now,
      source_urls: it.sources,
    })
    .select("id")
    .single();
  if (error) throw new Error(`${it.name}: ${error.message}`);

  const writes = [
    db.from("business_services").insert(
      it.services.map((s, i) => ({
        business_id: biz.id,
        service_id: serviceId.get(s)!,
        is_primary: i < 3,
      })),
    ),
  ];
  const extra = (it.extra_cities ?? []).filter((c) => c !== it.city);
  if (extra.length)
    writes.push(
      db.from("business_cities").upsert(
        extra.map((c) => ({ business_id: biz.id, city_id: cityId.get(c)! })),
        { onConflict: "business_id,city_id" },
      ),
    );
  if (it.hours?.length)
    writes.push(
      db.from("business_hours").insert(
        it.hours.map((h) => ({
          business_id: biz.id,
          weekday: h.weekday,
          opens_at: h.opens,
          closes_at: h.closes,
        })),
      ),
    );
  for (const r of await Promise.all(writes))
    if (r.error) throw new Error(`${it.name}: ${r.error.message}`);
  added++;
  console.log(`+ ${it.name} → /b/${slug}`);
}
console.log(`Imported ${added} businesses.`);

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
await fetch(`${site}/api/revalidate`, {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
}).catch(() => null);
