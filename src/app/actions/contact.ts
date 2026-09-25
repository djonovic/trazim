"use server";

import { z } from "zod";
import { withinRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

const input = z.object({
  businessId: z.uuid(),
  kind: z.enum(["phone", "viber", "whatsapp", "email"]),
});

/**
 * Reveals one contact value and counts the click. Numbers are never in the
 * page HTML or readable via the public API. Limited per visitor, so the
 * directory can't be scraped by looping over businesses.
 */
export async function revealContact(
  businessId: string,
  kind: string,
): Promise<{ value: string } | { error: "limit" | "generic" }> {
  const parsed = input.safeParse({ businessId, kind });
  if (!parsed.success) return { error: "generic" };
  if (!(await withinRateLimit("contact", 40, 3600))) return { error: "limit" };

  const { data, error } = await createAdminClient().rpc(
    "reveal_business_contact",
    {
      p_business_id: parsed.data.businessId,
      p_kind: parsed.data.kind,
    },
  );
  if (error) {
    console.error("reveal_business_contact failed", error.message);
    return { error: "generic" };
  }
  return data ? { value: data } : { error: "generic" };
}
