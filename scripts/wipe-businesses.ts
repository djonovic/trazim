// Deletes EVERY business with everything attached (reviews, photos and their
// files, price lists, hours, sponsorships, reports, requests sent to one
// business) plus the demo users. User accounts stay. Irreversible.
//
//   pnpm db:wipe --yes

import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");
if (!process.argv.includes("--yes")) {
  console.error("This deletes all businesses and reviews. Re-run with --yes.");
  process.exit(1);
}
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

async function emptyBucket(bucket: string) {
  const { data: folders } = await db.storage
    .from(bucket)
    .list("", { limit: 1000 });
  let removed = 0;
  for (const folder of folders ?? []) {
    const { data: files } = await db.storage
      .from(bucket)
      .list(folder.name, { limit: 1000 });
    if (files?.length) {
      await db.storage
        .from(bucket)
        .remove(files.map((f) => `${folder.name}/${f.name}`));
      removed += files.length;
    }
  }
  return removed;
}

const photos = await emptyBucket("business-photos");
const reviewPhotos = await emptyBucket("review-photos");
const { count: reviews } = await db
  .from("reviews")
  .delete({ count: "exact" })
  .not("id", "is", null);
const { count: businesses, error } = await db
  .from("businesses")
  .delete({ count: "exact" })
  .not("id", "is", null);
if (error) throw error;

const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
let demoUsers = 0;
for (const u of data.users.filter((u) =>
  /^(demo|e2e)\+.*@trazim\.me$/.test(u.email ?? ""),
)) {
  await db.auth.admin.deleteUser(u.id);
  demoUsers++;
}

// Price statistics are a materialized view: rebuild it without the old data.
const { error: statsError } = await db.rpc("refresh_price_stats");
if (statsError) console.warn("refresh_price_stats:", statsError.message);

console.log(
  `Deleted ${businesses} businesses, ${reviews} reviews, ${photos} photos, ${reviewPhotos} review photos, ${demoUsers} demo/test users.`,
);

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
await fetch(`${site}/api/revalidate`, {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
}).catch(() => null);
