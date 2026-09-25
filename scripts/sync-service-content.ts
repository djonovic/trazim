// Writes the hand-written service content (description, FAQ, tips in me/en/ru)
// to the database and refreshes cached pages. Safe to re-run.
//
//   pnpm db:content

import { createClient } from "@supabase/supabase-js";
import { serviceContent } from "../supabase/seed/data/service-content.ts";

process.loadEnvFile(".env.local");
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

let updated = 0;
for (const [slug, c] of Object.entries(serviceContent)) {
  const { data, error } = await db
    .from("services")
    .update({
      description_me: c.me.description,
      description_en: c.en.description,
      description_ru: c.ru.description,
      faq_me: c.me.faq,
      faq_en: c.en.faq,
      faq_ru: c.ru.faq,
      tips_me: c.me.tips,
      tips_en: c.en.tips,
      tips_ru: c.ru.tips,
    })
    .eq("slug_me", slug)
    .select("id");
  if (error) throw error;
  if (!data.length) console.warn(`No service with slug_me "${slug}"`);
  else updated++;
}
console.log(`Updated content for ${updated} services.`);

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
    : `Couldn't reach ${site}/api/revalidate; pages refresh within a day.`,
);
