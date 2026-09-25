"use server";

import { z } from "zod";
import { withinRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Counts a profile view (pages are cached, so this runs from the browser).
 * One view per visitor, business and day.
 */
export async function trackView(businessId: string) {
  const id = z.uuid().safeParse(businessId);
  if (!id.success) return;
  if (!(await withinRateLimit(`view:${id.data}`, 1, 86400))) return;
  const { error } = await createAdminClient().rpc("track_business_view", {
    p_business_id: id.data,
  });
  if (error) console.error("track_business_view failed", error.message);
}
