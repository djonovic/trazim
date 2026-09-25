import "server-only";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

/** The signed-in user, or null. Reads cookies, so the page renders dynamically. */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
});

/** Signed-in user or a redirect to /prijava that comes back to `next`. */
export async function requireUser(locale: Locale, next: string) {
  const user = await getUser();
  if (!user) {
    const login = getPathname({ locale, href: "/prijava" });
    redirect(`${login}?next=${encodeURIComponent(next)}`);
  }
  return user;
}

/** Admin user, a login redirect, or a 404 for everyone else (the admin area isn't advertised). */
export async function requireAdmin(locale: Locale) {
  const user = await requireUser(locale, "/admin");
  if (!(await isAdmin(user.id))) notFound();
  return user;
}

export const isAdmin = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
});
