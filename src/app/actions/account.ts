"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const nameSchema = z.string().trim().min(2).max(80);

/** Saves the display name to the profile (shown on reviews as "Marko P."). */
export async function updateName(name: string) {
  const parsed = nameSchema.safeParse(name);
  if (!parsed.success) return { ok: false as const };

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false as const };

  const [{ error }] = await Promise.all([
    supabase
      .from("profiles")
      .update({ full_name: parsed.data })
      .eq("id", data.user.id),
    supabase.auth.updateUser({ data: { full_name: parsed.data } }),
  ]);
  return { ok: !error };
}
