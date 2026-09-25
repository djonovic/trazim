"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const input = z.object({
  businessId: z.uuid(),
  kind: z.enum(["phone", "viber", "whatsapp", "email"]),
});

/**
 * Reveals one contact value and counts the click. Numbers are never in the
 * page HTML or readable via the public API.
 * TODO(phase 7): rate-limit per IP before calling the database.
 */
export async function revealContact(businessId: string, kind: string) {
  const parsed = input.safeParse({ businessId, kind });
  if (!parsed.success) return null;

  const { data, error } = await createAdminClient().rpc(
    "reveal_business_contact",
    {
      p_business_id: parsed.data.businessId,
      p_kind: parsed.data.kind,
    },
  );
  if (error) {
    console.error("reveal_business_contact failed", error.message);
    return null;
  }
  return data;
}
