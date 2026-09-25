// Gives (or takes away) the admin role. The user must have signed in once.
//
//   pnpm admin:set ime@primjer.com           # make admin
//   pnpm admin:set ime@primjer.com --remove  # back to a normal user

import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const email = process.argv[2]?.trim().toLowerCase();
const remove = process.argv.includes("--remove");
if (!email || !email.includes("@")) {
  console.error("Usage: pnpm admin:set <email> [--remove]");
  process.exit(1);
}

// listUsers has no email filter; walk the pages (fine at this scale).
let userId: string | undefined;
for (let page = 1; !userId; page++) {
  const { data, error } = await db.auth.admin.listUsers({
    page,
    perPage: 1000,
  });
  if (error) throw error;
  userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id;
  if (data.users.length < 1000) break;
}
if (!userId) {
  console.error(`No user with email ${email}. Sign in on the site once first.`);
  process.exit(1);
}

const role = remove ? "user" : "admin";
const { error } = await db.from("profiles").update({ role }).eq("id", userId);
if (error) throw error;
console.log(
  `${email} is now ${role === "admin" ? "an admin" : "a regular user"}.`,
);
