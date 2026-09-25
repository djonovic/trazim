// Runs all migrations + seed in PGlite (in-process Postgres) with minimal
// Supabase stubs (auth, storage, cron, roles) and checks RLS, triggers,
// search and price stats. Run: pnpm test:db

import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { unaccent } from "@electric-sql/pglite/contrib/unaccent";
import { readFileSync, readdirSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const db = new PGlite({ extensions: { pg_trgm, unaccent } });

// --- Minimal Supabase stubs -------------------------------------------------
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema extensions; grant usage on schema extensions to anon, authenticated, service_role;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;
  create schema storage;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  create function storage.foldername(name text) returns text[] language sql immutable as
    $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
  grant usage on schema storage to anon, authenticated;
  grant all on storage.objects to anon, authenticated;
  create schema cron;
  create table cron.job (name text, schedule text, command text);
  create function cron.schedule(n text, s text, c text) returns bigint language sql as
    $$ insert into cron.job values (n, s, c); select 1::bigint $$;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
`);

for (const f of readdirSync(`${ROOT}/migrations`).sort()) {
  let sql = readFileSync(`${ROOT}/migrations/${f}`, "utf8");
  sql = sql.replace("create extension if not exists pg_cron;", "");
  try {
    await db.exec(sql);
    console.log("✓ migration", f);
  } catch (e) {
    console.error(
      "✗ migration",
      f,
      e.message,
      e.position
        ? `at ${e.position}: ${sql.slice(e.position - 80, Number(e.position) + 80)}`
        : "",
    );
    process.exit(1);
  }
}
await db.exec(readFileSync(`${ROOT}/seed.sql`, "utf8"));
console.log("✓ seed");

// --- Helpers ------------------------------------------------------------------
let failures = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "✓" : "✗"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) failures++;
};
const as = async (role, uid, fn) => {
  await db.exec(
    `set role ${role}; select set_config('request.jwt.claim.sub', '${uid ?? ""}', false);`,
  );
  try {
    return await fn();
  } finally {
    await db.exec(
      `reset role; select set_config('request.jwt.claim.sub', '', false);`,
    );
  }
};
const fails = async (p) => {
  try {
    await p;
    return false;
  } catch {
    return true;
  }
};
const one = async (sql, params) => (await db.query(sql, params)).rows[0];

// --- Seed counts ----------------------------------------------------------------
const counts =
  await one(`select (select count(*) from cities)::int c, (select count(*) from services)::int s,
  (select count(*) from cities where parent_city_id is not null)::int st`);
check(
  "seed counts",
  counts.c === 68 && counts.s === 187 && counts.st === 43,
  JSON.stringify(counts),
);

// --- Search ---------------------------------------------------------------------
for (const [term, expected] of [
  ["elektricar", "Električar"],
  ["santehnik", "Vodoinstalater"],
  ["vodoinst", "Vodoinstalater"],
  ["plumber", "Vodoinstalater"],
  ["ciscenje apar", "Čišćenje apartmana"],
  ["engleski", "Časovi engleskog jezika"],
]) {
  const rows = (
    await db.query(`select name_me from search_services($1)`, [term])
  ).rows.map((r) => r.name_me);
  check(`search "${term}"`, rows[0] === expected, rows.slice(0, 3).join(", "));
}
const city = (await db.query(`select name_me from search_cities('niksic')`))
  .rows[0]?.name_me;
check(`search city "niksic"`, city === "Nikšić", city);
const hn = (await db.query(`select name_me from search_cities('herceg')`))
  .rows[0]?.name_me;
check(`search city "herceg"`, hn === "Herceg Novi", hn);

// --- Users ----------------------------------------------------------------------
const owner = (
  await one(
    `insert into auth.users (raw_user_meta_data) values ('{"full_name":"Marko Vlasnik"}') returning id`,
  )
).id;
const user2 = (await one(`insert into auth.users default values returning id`))
  .id;
const admin = (await one(`insert into auth.users default values returning id`))
  .id;
await db.query(`update profiles set role = 'admin' where id = $1`, [admin]);
check(
  "profile created by trigger",
  (await one(`select full_name from profiles where id = $1`, [owner]))
    .full_name === "Marko Vlasnik",
);
check(
  "user can't promote self",
  await fails(
    as("authenticated", user2, () =>
      db.query(`update profiles set role='admin' where id=$1`, [user2]),
    ),
  ),
);

const pg = (await one(`select id from cities where slug='podgorica'`)).id;
const plumber = (
  await one(`select id from services where slug_me='vodoinstalater'`)
).id;

// --- Businesses -----------------------------------------------------------------
const biz = await as(
  "authenticated",
  owner,
  async () =>
    (
      await one(
        `insert into businesses (owner_id, slug, name, city_id, phone) values ($1, 'marko-vodoinstalater', 'Marko Vodoinstalater', $2, '+38267111222') returning id`,
        [owner, pg],
      )
    ).id,
);
check("owner creates business", Boolean(biz));
// Owners can't pre-fill verification, ratings or counters: they're reset.
const forged = await as("authenticated", owner, () =>
  one(
    `insert into businesses (owner_id, slug, name, city_id, verified_at, rating_avg, rating_count, views_count)
     values ($1, 'x-y', 'X', $2, now(), 5, 900, 50000)
     returning id, verified_at, rating_avg, rating_count, views_count`,
    [owner, pg],
  ),
);
check(
  "owner can't create verified or pre-rated business",
  forged.verified_at === null &&
    Number(forged.rating_avg) === 0 &&
    forged.rating_count === 0 &&
    forged.views_count === 0,
);
await db.query(`delete from businesses where id=$1`, [forged.id]);
check(
  "can't create business for someone else",
  await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into businesses (owner_id, slug, name, city_id) values ($1, 'z-z', 'Z', $2)`,
        [owner, pg],
      ),
    ),
  ),
);

await as("authenticated", owner, () =>
  db.query(
    `update businesses set verified_at = now(), status='active', name='Marko V.' where id=$1`,
    [biz],
  ),
);
const b1 = await one(`select verified_at, name from businesses where id=$1`, [
  biz,
]);
check(
  "owner can't self-verify but can rename",
  b1.verified_at === null && b1.name === "Marko V.",
);

const upd = await as("authenticated", user2, () =>
  db.query(`update businesses set name='Hacked' where id=$1`, [biz]),
);
check(
  "other user can't update business",
  upd.affectedRows === 0 &&
    (await one(`select name from businesses where id=$1`, [biz])).name ===
      "Marko V.",
);

await as("authenticated", owner, () =>
  db.query(
    `insert into business_services (business_id, service_id, is_primary) values ($1, $2, true)`,
    [biz, plumber],
  ),
);
check(
  "main city synced into service area",
  (
    await db.query(
      `select 1 from business_cities where business_id=$1 and city_id=$2`,
      [biz, pg],
    )
  ).rows.length === 1,
);
const fourPrimary = await fails(
  as("authenticated", owner, async () => {
    for (const slug of ["elektricar", "kucni-majstor", "moler"]) {
      await db.query(
        `insert into business_services (business_id, service_id, is_primary) select $1, id, true from services where slug_me=$2`,
        [biz, slug],
      );
    }
  }),
);
check("max 3 primary services", fourPrimary);

check(
  "anon sees active business",
  (
    await as("anon", null, () =>
      db.query(`select id from businesses where id=$1`, [biz]),
    )
  ).rows.length === 1,
);
await as("authenticated", admin, () =>
  db.query(`update businesses set status='suspended' where id=$1`, [biz]),
);
check(
  "anon doesn't see suspended business",
  (
    await as("anon", null, () =>
      db.query(`select id from businesses where id=$1`, [biz]),
    )
  ).rows.length === 0,
);
check(
  "anon doesn't see its services either",
  (
    await as("anon", null, () =>
      db.query(`select * from business_services where business_id=$1`, [biz]),
    )
  ).rows.length === 0,
);
check(
  "owner still sees suspended business",
  (
    await as("authenticated", owner, () =>
      db.query(`select id from businesses where id=$1`, [biz]),
    )
  ).rows.length === 1,
);
await as("authenticated", admin, () =>
  db.query(
    `update businesses set status='active', verified_at=now() where id=$1`,
    [biz],
  ),
);
check(
  "admin verifies",
  (await one(`select verified_at from businesses where id=$1`, [biz]))
    .verified_at !== null,
);

// --- Reviews --------------------------------------------------------------------
check(
  "owner can't review own business",
  await fails(
    as("authenticated", owner, () =>
      db.query(
        `insert into reviews (business_id, user_id, rating) values ($1, $2, 5)`,
        [biz, owner],
      ),
    ),
  ),
);
const rev = await as(
  "authenticated",
  user2,
  async () =>
    (
      await one(
        `insert into reviews (business_id, user_id, rating, body) values ($1, $2, 4, 'Brzo i korektno') returning id`,
        [biz, user2],
      )
    ).id,
);
check(
  "second review by same user fails",
  await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into reviews (business_id, user_id, rating) values ($1, $2, 5)`,
        [biz, user2],
      ),
    ),
  ),
);
let r = await one(
  `select rating_avg::float, rating_count from businesses where id=$1`,
  [biz],
);
check(
  "rating aggregated",
  r.rating_avg === 4 && r.rating_count === 1,
  JSON.stringify(r),
);
await as("authenticated", user2, () =>
  db.query(`update reviews set rating=5 where id=$1`, [rev]),
);
r = await one(
  `select b.rating_avg::float, r.edited_at from businesses b join reviews r on r.business_id=b.id where r.id=$1`,
  [rev],
);
check(
  "edit updates rating and edited_at",
  r.rating_avg === 5 && r.edited_at !== null,
);
check(
  "author can't write the reply",
  await fails(
    as("authenticated", user2, () =>
      db.query(`update reviews set reply_body='x' where id=$1`, [rev]),
    ),
  ),
);
await as("authenticated", owner, () =>
  db.query(`update reviews set reply_body='Hvala!' where id=$1`, [rev]),
);
check(
  "owner replies",
  (await one(`select reply_body, replied_at from reviews where id=$1`, [rev]))
    .replied_at !== null,
);
check(
  "owner can't change rating",
  await fails(
    as("authenticated", owner, () =>
      db.query(`update reviews set rating=1 where id=$1`, [rev]),
    ),
  ),
);
await db.query(
  `update profiles set full_name='Ana Maria Petrović' where id=$1`,
  [user2],
);
const pr = await as("anon", null, () =>
  db.query(
    `select author_name, business_slug from public_reviews where id=$1`,
    [rev],
  ),
);
check(
  "public_reviews shows short author name",
  pr.rows[0]?.author_name === "Ana P." &&
    pr.rows[0]?.business_slug === "marko-vodoinstalater",
  JSON.stringify(pr.rows[0]),
);
check(
  "anon reads published review",
  (
    await as("anon", null, () =>
      db.query(`select id from reviews where id=$1`, [rev]),
    )
  ).rows.length === 1,
);

// --- Reports --------------------------------------------------------------------
await as("authenticated", owner, () =>
  db.query(
    `insert into reports (reporter_id, target, review_id, reason) values ($1, 'review', $2, 'false_info')`,
    [owner, rev],
  ),
);
check(
  "users can't read reports",
  (await as("authenticated", owner, () => db.query(`select * from reports`)))
    .rows.length === 0,
);
check(
  "admin reads reports",
  (await as("authenticated", admin, () => db.query(`select * from reports`)))
    .rows.length === 1,
);

check(
  "review report gets its business_id",
  (await one(`select business_id from reports where review_id=$1`, [rev]))
    .business_id === biz,
);
check(
  "second open report on same target fails",
  await fails(
    as("authenticated", owner, () =>
      db.query(
        `insert into reports (reporter_id, target, review_id, reason) values ($1, 'review', $2, 'spam')`,
        [owner, rev],
      ),
    ),
  ),
);
check(
  "reporter can't pre-fill resolution",
  await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into reports (reporter_id, target, business_id, reason, resolution_note) values ($1, 'business', $2, 'spam', 'ok')`,
        [user2, biz],
      ),
    ),
  ),
);
// 20 reports in a day is the limit (resolved ones don't hit the unique index).
await db.query(
  `insert into reports (reporter_id, target, business_id, reason, status)
   select $1, 'business', $2, 'spam', 'resolved' from generate_series(1, 20)`,
  [user2, biz],
);
check(
  "report rate limit",
  await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into reports (reporter_id, target, business_id, reason) values ($1, 'business', $2, 'spam')`,
        [user2, biz],
      ),
    ),
  ),
);
await db.query(`delete from reports where reporter_id=$1`, [user2]);

// --- Moderation -------------------------------------------------------------------
await as("authenticated", admin, () =>
  db.query(
    `update businesses set moderation_note='Nedostaje opis' where id=$1`,
    [biz],
  ),
);
await as("authenticated", owner, () =>
  db.query(`update businesses set moderation_note=null where id=$1`, [biz]),
);
check(
  "owner can't clear moderation note",
  (await one(`select moderation_note from businesses where id=$1`, [biz]))
    .moderation_note === "Nedostaje opis",
);
check(
  "anon can't read moderation note",
  await fails(
    as("anon", null, () => db.query(`select moderation_note from businesses`)),
  ),
);
check(
  "users can't write the admin log",
  await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into admin_actions (admin_id, action) values ($1, 'approve')`,
        [user2],
      ),
    ),
  ),
);
await as("authenticated", admin, () =>
  db.query(
    `insert into admin_actions (admin_id, action, business_id) values ($1, 'approve', $2)`,
    [admin, biz],
  ),
);
check(
  "admin writes and reads the log; users see nothing",
  (
    await as("authenticated", admin, () =>
      db.query(`select * from admin_actions`),
    )
  ).rows.length === 1 &&
    (
      await as("authenticated", user2, () =>
        db.query(`select * from admin_actions`),
      )
    ).rows.length === 0,
);

// --- Tracking -------------------------------------------------------------------
check(
  "anon can't call track_business_view",
  await fails(
    as("anon", null, () => db.query(`select track_business_view($1)`, [biz])),
  ),
);
await as("service_role", null, async () => {
  await db.query(`select track_business_view($1)`, [biz]);
  await db.query(`select track_business_contact($1, 'viber')`, [biz]);
  await db.query(`select track_business_contact($1, 'viber')`, [biz]);
});
const st = await one(
  `select views, contact_viber from business_daily_stats where business_id=$1`,
  [biz],
);
check(
  "tracking counters",
  st.views === 1 && st.contact_viber === 2,
  JSON.stringify(st),
);
check(
  "stats hidden from other users",
  (
    await as("authenticated", user2, () =>
      db.query(`select * from business_daily_stats`),
    )
  ).rows.length === 0,
);

// --- Price stats ----------------------------------------------------------------
const preset = (
  await one(
    `insert into service_price_items (service_id, name_me, name_en, name_ru, unit) values ($1, 'Odgušenje odvoda', 'Drain unblocking', 'Прочистка канализации', 'job') returning id`,
    [plumber],
  )
).id;
await as("authenticated", owner, async () => {
  await db.query(
    `insert into price_list_items (business_id, service_id, preset_id, name, kind, price_from, unit) values ($1, $2, $3, 'Odgušenje', 'fixed', 30, 'job')`,
    [biz, plumber, preset],
  );
  await db.query(
    `insert into price_list_items (business_id, service_id, name, kind, price_from, price_to, unit) values ($1, $2, 'Zamjena bojlera', 'range', 40, 80, 'job')`,
    [biz, plumber],
  );
  await db.query(
    `insert into price_list_items (business_id, service_id, name, kind, unit) values ($1, $2, 'Procjena', 'free', 'job')`,
    [biz, plumber],
  );
});
check(
  "invalid price rejected",
  await fails(
    as("authenticated", owner, () =>
      db.query(
        `insert into price_list_items (business_id, name, kind, price_from, price_to) values ($1, 'x', 'range', 50, 10)`,
        [biz],
      ),
    ),
  ),
);
await db.query(`select refresh_price_stats()`);
const ps = (
  await db.query(
    `select city_key, price_avg::float, price_min::float, price_max::float, items_count from price_stats where service_id=$1 order by city_key`,
    [plumber],
  )
).rows;
check(
  "price_stats country + city rows",
  ps.length === 2 &&
    ps.every(
      (p) =>
        p.price_avg === 45 &&
        p.price_min === 30 &&
        p.price_max === 80 &&
        p.items_count === 2,
    ),
  JSON.stringify(ps),
);
const quart = await one(
  `select price_p25::float p25, price_median::float med, price_p75::float p75, computed_at from price_stats where service_id=$1 and city_key=0`,
  [plumber],
);
check(
  "price_stats quartiles and computed_at",
  quart.p25 < quart.med && quart.med < quart.p75 && quart.computed_at != null,
  JSON.stringify(quart),
);
const pis = (
  await db.query(`select * from price_item_stats where preset_id=$1`, [preset])
).rows;
check("price_item_stats", pis.length === 2);
check(
  "anon can read price_stats",
  (await as("anon", null, () => db.query(`select * from price_stats`))).rows
    .length === 2,
);
check(
  "cron job registered",
  (await db.query(`select * from cron.job`)).rows.length === 1,
);

// --- Sponsorships ---------------------------------------------------------------
await as("authenticated", admin, () =>
  db.query(
    `insert into sponsorships (business_id, scope, service_id, city_id, ends_at) values ($1, 'service_city', $2, $3, now() + interval '30 days')`,
    [biz, plumber, pg],
  ),
);
check(
  "owner can't create sponsorship",
  await fails(
    as("authenticated", owner, () =>
      db.query(
        `insert into sponsorships (business_id, scope, ends_at) values ($1, 'home', now() + interval '1 day')`,
        [biz],
      ),
    ),
  ),
);
check(
  "anon sees active sponsorship",
  (await as("anon", null, () => db.query(`select * from sponsorships`))).rows
    .length === 1,
);
check(
  "scope fields enforced",
  await fails(
    db.query(
      `insert into sponsorships (business_id, scope, ends_at) values ($1, 'service', now() + interval '1 day')`,
      [biz],
    ),
  ),
);

// --- Inquiries (basic lifecycle) ---------------------------------------------------
const inqOld = await as(
  "authenticated",
  user2,
  async () =>
    (
      await one(
        `insert into inquiries (user_id, service_id, city_id, body, status) values ($1, $2, $3, 'Curi cijev u kupatilu, treba hitno', 'approved') returning id`,
        [user2, plumber, pg],
      )
    ).id,
);
check(
  "author can't reject (moderate) own inquiry",
  await fails(
    as("authenticated", user2, () =>
      db.query(`update inquiries set status='rejected' where id=$1`, [inqOld]),
    ),
  ),
);
await as("authenticated", user2, () =>
  db.query(`update inquiries set status='closed' where id=$1`, [inqOld]),
);
check(
  "author closes inquiry",
  (await one(`select status from inquiries where id=$1`, [inqOld])).status ===
    "closed",
);
check(
  "closed inquiries aren't shown to businesses",
  (
    await as("authenticated", owner, () =>
      db.query(`select id from inquiries where id=$1`, [inqOld]),
    )
  ).rows.length === 0,
);

// --- Storage --------------------------------------------------------------------
check(
  "owner uploads to own folder",
  !(await fails(
    as("authenticated", owner, () =>
      db.query(
        `insert into storage.objects (bucket_id, name) values ('business-photos', $1)`,
        [`${biz}/cover.webp`],
      ),
    ),
  )),
);
check(
  "other user can't upload to that folder",
  await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into storage.objects (bucket_id, name) values ('business-photos', $1)`,
        [`${biz}/evil.webp`],
      ),
    ),
  ),
);
check(
  "garbage path rejected",
  await fails(
    as("authenticated", owner, () =>
      db.query(
        `insert into storage.objects (bucket_id, name) values ('business-photos', 'not-a-uuid/x.webp')`,
      ),
    ),
  ),
);

// --- Contact privacy -------------------------------------------------------------
check(
  "anon can't read phone column",
  await fails(as("anon", null, () => db.query(`select phone from businesses`))),
);
check(
  "anon reads public columns",
  (
    await as("anon", null, () =>
      db.query(`select id, name from businesses where id=$1`, [biz]),
    )
  ).rows.length === 1,
);
check(
  "anon sees which channels exist",
  (
    await as("anon", null, () =>
      db.query(
        `select has_phone from business_contact_channels where business_id=$1`,
        [biz],
      ),
    )
  ).rows[0]?.has_phone === true,
);
check(
  "anon can't call reveal_business_contact",
  await fails(
    as("anon", null, () =>
      db.query(`select reveal_business_contact($1, 'phone')`, [biz]),
    ),
  ),
);
check(
  "no WhatsApp set: nothing revealed, no fallback to the phone",
  (
    await as("service_role", null, () =>
      db.query(`select reveal_business_contact($1, 'whatsapp') as v`, [biz]),
    )
  ).rows[0].v === null,
);
await db.query(`update businesses set whatsapp='+38267111222' where id=$1`, [
  biz,
]);
const revealed = await as("service_role", null, () =>
  db.query(`select reveal_business_contact($1, 'whatsapp') as v`, [biz]),
);
check(
  "service role reveals contact and counts it",
  revealed.rows[0].v === "+38267111222" &&
    (
      await one(
        `select contact_whatsapp from business_daily_stats where business_id=$1`,
        [biz],
      )
    ).contact_whatsapp === 1,
);

// --- Review photos ----------------------------------------------------------------
await as("authenticated", user2, () =>
  db.query(
    `insert into review_photos (review_id, storage_path) values ($1, $2)`,
    [rev, `${rev}/1.webp`],
  ),
);
check(
  "non-author can't add photos to a review",
  await fails(
    as("authenticated", owner, () =>
      db.query(
        `insert into review_photos (review_id, storage_path) values ($1, $2)`,
        [rev, `${rev}/x.webp`],
      ),
    ),
  ),
);
check(
  "anon sees photos of a published review",
  (
    await as("anon", null, () =>
      db.query(`select id from review_photos where review_id=$1`, [rev]),
    )
  ).rows.length === 1,
);
for (const n of [2, 3, 4])
  await as("authenticated", user2, () =>
    db.query(
      `insert into review_photos (review_id, storage_path) values ($1, $2)`,
      [rev, `${rev}/${n}.webp`],
    ),
  );
check(
  "at most 4 photos per review",
  await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into review_photos (review_id, storage_path) values ($1, $2)`,
        [rev, `${rev}/5.webp`],
      ),
    ),
  ),
);
check(
  "author uploads to review-photos/{review_id}/, others can't",
  !(await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into storage.objects (bucket_id, name) values ('review-photos', $1)`,
        [`${rev}/a.webp`],
      ),
    ),
  )) &&
    (await fails(
      as("authenticated", owner, () =>
        db.query(
          `insert into storage.objects (bucket_id, name) values ('review-photos', $1)`,
          [`${rev}/b.webp`],
        ),
      ),
    )),
);

// --- Inquiries -----------------------------------------------------------------------
const customer = (
  await one(
    `insert into auth.users (raw_user_meta_data) values ('{"full_name":"Ana Kupac"}') returning id`,
  )
).id;
const niksic = (await one(`select id from cities where slug='niksic'`)).id;
const newInquiry = (cityId, extra = "") =>
  as(
    "authenticated",
    customer,
    async () =>
      (
        await one(
          `insert into inquiries (user_id, service_id, city_id, body, phone, status${extra ? ", business_id" : ""})
         values ($1, $2, $3, 'Curi bojler u kupatilu, treba zamjena ventila.', '+38269123456', 'approved'${extra ? ", $4" : ""}) returning id`,
          extra
            ? [customer, plumber, cityId, extra]
            : [customer, plumber, cityId],
        )
      ).id,
  );
const inq = await newInquiry(pg);
check(
  "matching business owner sees the inquiry",
  (
    await as("authenticated", owner, () =>
      db.query(`select id from inquiries where id=$1`, [inq]),
    )
  ).rows.length === 1,
);
check(
  "other users don't see it",
  (
    await as("authenticated", user2, () =>
      db.query(`select id from inquiries where id=$1`, [inq]),
    )
  ).rows.length === 0,
);
const inqNk = await newInquiry(niksic);
check(
  "business in another town doesn't see it",
  (
    await as("authenticated", owner, () =>
      db.query(`select id from inquiries where id=$1`, [inqNk]),
    )
  ).rows.length === 0,
);
check(
  "phone isn't readable through the API",
  await fails(
    as("authenticated", owner, () =>
      db.query(`select phone from inquiries where id=$1`, [inq]),
    ),
  ),
);
const revealedInq = await as("authenticated", owner, () =>
  db.query(`select * from reveal_inquiry_contact($1, $2)`, [inq, biz]),
);
check(
  "matching owner reveals phone and name",
  revealedInq.rows[0]?.phone === "+38269123456" &&
    revealedInq.rows[0]?.name === "Ana Kupac",
);
check(
  "non-matching user can't reveal",
  await fails(
    as("authenticated", user2, () =>
      db.query(`select * from reveal_inquiry_contact($1, $2)`, [inq, biz]),
    ),
  ),
);
check(
  "author sees that one business opened the contact",
  (
    await as("authenticated", customer, () =>
      db.query(`select * from inquiry_reveals where inquiry_id=$1`, [inq]),
    )
  ).rows.length === 1,
);
const direct = await newInquiry(niksic, biz);
check(
  "inquiry sent to one business is visible to it regardless of town",
  (
    await as("authenticated", owner, () =>
      db.query(`select id from inquiries where id=$1`, [direct]),
    )
  ).rows.length === 1,
);
await newInquiry(pg);
await newInquiry(pg);
check("inquiry rate limit (5 a day)", await fails(newInquiry(pg)));
check(
  "author can't create a pending/other-user inquiry",
  await fails(
    as("authenticated", customer, () =>
      db.query(
        `insert into inquiries (user_id, service_id, city_id, body, status) values ($1, $2, $3, 'aaaaaaaaaaaaaaaaaaaaaaaa', 'approved')`,
        [user2, plumber, pg],
      ),
    ),
  ),
);

// --- Banners ------------------------------------------------------------------------
const banner = (
  await as("authenticated", admin, () =>
    one(
      `insert into banners (service_id, advertiser, title, link_url, ends_at) values ($1, 'Keramika d.o.o.', 'Pločice na akciji', 'https://example.me', now() + interval '30 days') returning id`,
      [plumber],
    ),
  )
).id;
check(
  "users can't create banners",
  await fails(
    as("authenticated", user2, () =>
      db.query(
        `insert into banners (service_id, advertiser, title, link_url, ends_at) values ($1, 'X', 'Y', 'https://x.me', now() + interval '1 day')`,
        [plumber],
      ),
    ),
  ),
);
check(
  "anon sees a running banner",
  (
    await as("anon", null, () =>
      db.query(`select id from banners where id=$1`, [banner]),
    )
  ).rows.length === 1,
);
await as("authenticated", admin, () =>
  db.query(`update banners set status='paused' where id=$1`, [banner]),
);
check(
  "paused banner is hidden from anon",
  (
    await as("anon", null, () =>
      db.query(`select id from banners where id=$1`, [banner]),
    )
  ).rows.length === 0,
);
check(
  "anon can't call track_banner_click",
  await fails(
    as("anon", null, () => db.query(`select track_banner_click($1)`, [banner])),
  ),
);
await db.query(`update banners set status='active' where id=$1`, [banner]);
const clicked = await as("service_role", null, () =>
  one(`select track_banner_click($1) as url`, [banner]),
);
check(
  "click is counted and returns the link",
  clicked.url === "https://example.me" &&
    (await one(`select clicks from banners where id=$1`, [banner])).clicks ===
      1,
);
check(
  "banner scope fields enforced (home banner can't have a service)",
  await fails(
    db.query(
      `insert into banners (scope, service_id, advertiser, title, link_url, ends_at) values ('home', $1, 'X', 'Y', 'https://x.me', now() + interval '1 day')`,
      [plumber],
    ),
  ),
);
let cityBannerError = null;
try {
  await db.query(
    `insert into banners (scope, city_id, advertiser, title, link_url, ends_at) values ('city', $1, 'Xx', 'Yy', 'https://x.me', now() + interval '1 day')`,
    [pg],
  );
} catch (e) {
  cityBannerError = e.message;
}
check("city banner saves", cityBannerError === null, cityBannerError ?? "");
check(
  "banner link must be http(s)",
  await fails(
    db.query(
      `insert into banners (service_id, advertiser, title, link_url, ends_at) values ($1, 'X', 'Y', 'javascript:alert(1)', now() + interval '1 day')`,
      [plumber],
    ),
  ),
);

// --- Import sources are private ---------------------------------------------------
check(
  "anon can't read source_urls",
  await fails(
    as("anon", null, () => db.query(`select source_urls from businesses`)),
  ),
);

// --- Business search -------------------------------------------------------------
// (the business was renamed to "Marko V." above)
const found = await as("anon", null, () =>
  db.query(`select id from search_business_ids('márko')`),
);
check(
  "anon finds active business by name, ignoring diacritics",
  found.rows.some((r) => r.id === biz),
  `${found.rows.length} rows`,
);
check(
  "one-letter queries return nothing",
  (
    await as("anon", null, () =>
      db.query(`select id from search_business_ids('m')`),
    )
  ).rows.length === 0,
);

// --- Hardening -----------------------------------------------------------------------
// Inquiries: a rejected one can't be re-approved by its author, dates are the server's.
const inqRejected = await as(
  "authenticated",
  user2,
  async () =>
    await one(
      `insert into inquiries (user_id, service_id, city_id, body, status, created_at)
       values ($1, $2, $3, 'Treba mi majstor za bojler u stanu.', 'approved', '2000-01-01') returning id, created_at`,
      [user2, plumber, pg],
    ),
);
check(
  "inquiry created_at can't be backdated",
  new Date(inqRejected.created_at).getFullYear() > 2000,
);
await as("authenticated", admin, () =>
  db.query(`update inquiries set status='rejected' where id=$1`, [
    inqRejected.id,
  ]),
);
check(
  "author can't re-approve a rejected inquiry",
  await fails(
    as("authenticated", user2, () =>
      db.query(`update inquiries set status='approved' where id=$1`, [
        inqRejected.id,
      ]),
    ),
  ),
);

// Reviews: a hidden review can't be deleted by its author (and re-posted).
const hiddenReview = await as(
  "authenticated",
  customer,
  async () =>
    (
      await one(
        `insert into reviews (business_id, user_id, rating, body) values ($1, $2, 1, 'Loše iskustvo sa ovim majstorom.') returning id`,
        [biz, customer],
      )
    ).id,
);
await as("authenticated", admin, () =>
  db.query(`update reviews set status='hidden' where id=$1`, [hiddenReview]),
);
await as("authenticated", customer, () =>
  db.query(`delete from reviews where id=$1`, [hiddenReview]),
);
check(
  "author can't delete a review hidden by an admin",
  Boolean(await one(`select id from reviews where id=$1`, [hiddenReview])),
);

// Service, town and photo limits hold for direct API writes.
const extraServices = (
  await db.query(`select id from services where id <> $1 order by id limit 3`, [
    plumber,
  ])
).rows.map((r) => r.id);
await db.query(
  `delete from business_services where business_id=$1 and service_id <> $2`,
  [biz, plumber],
);
await db.query(
  `update business_services set is_primary=true where business_id=$1`,
  [biz],
);
check(
  "at most 3 main services through the API",
  await fails(
    as("authenticated", owner, async () => {
      for (const id of extraServices)
        await db.query(
          `insert into business_services (business_id, service_id, is_primary) values ($1, $2, true)`,
          [biz, id],
        );
    }),
  ),
);
await db.query(
  `delete from business_services where business_id=$1 and service_id <> $2`,
  [biz, plumber],
);
check(
  "photo rows must point into the business's own folder",
  await fails(
    as("authenticated", owner, () =>
      db.query(
        `insert into business_photos (business_id, storage_path) values ($1, $2)`,
        [biz, `${biz}/../../review-photos/x.webp`],
      ),
    ),
  ),
);

// Replacing hours is all-or-nothing, and only for the owner.
await as("authenticated", owner, () =>
  db.query(
    `select set_business_hours($1, '[{"weekday":1,"opens_at":"08:00","closes_at":"16:00"}]')`,
    [biz],
  ),
);
await as("authenticated", owner, () =>
  db
    .query(
      `select set_business_hours($1, '[{"weekday":9,"opens_at":"08:00","closes_at":"16:00"}]')`,
      [biz],
    )
    .catch(() => null),
);
check(
  "failed hours save keeps the old hours",
  (
    await one(
      `select count(*)::int n from business_hours where business_id=$1`,
      [biz],
    )
  ).n === 1,
);
check(
  "other user can't replace hours",
  await fails(
    as("authenticated", user2, () =>
      db.query(`select set_business_hours($1, '[]')`, [biz]),
    ),
  ),
);

// Rate limits: server-only, and they count.
check(
  "anon can't call rate_limit_hit",
  await fails(
    as("anon", null, () => db.query(`select rate_limit_hit('x', 1, 60)`)),
  ),
);
const hits = [];
for (let i = 0; i < 2; i++)
  hits.push(
    (
      await as("service_role", null, () =>
        one(`select rate_limit_hit('test:ip', 1, 60) as ok`),
      )
    ).ok,
  );
check("rate limit allows then blocks", hits[0] === true && hits[1] === false);

console.log(failures ? `\n${failures} FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
