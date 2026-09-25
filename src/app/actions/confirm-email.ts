"use server";

import { redirect } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { safeNext } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

const TYPES = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const satisfies readonly EmailOtpType[];

/** Uses the email token only after the person clicks. Inbox scanners stop at the page. */
export async function confirmEmailLink(formData: FormData) {
  const tokenHash = String(formData.get("token_hash") ?? "");
  const type = String(formData.get("type") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));
  const login = `/prijava?error=callback&next=${encodeURIComponent(next)}`;

  if (!tokenHash || !TYPES.includes(type as (typeof TYPES)[number])) {
    redirect(login);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as EmailOtpType,
  });
  if (error) redirect(login);
  redirect(next);
}
