"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

/** Counts a profile view (pages are cached, so this runs from the browser). */
export async function trackView(businessId: string) {
  const id = z.uuid().safeParse(businessId);
  if (!id.success) return;
  const { error } = await createAdminClient().rpc("track_business_view", {
    p_business_id: id.data,
  });
  if (error) console.error("track_business_view failed", error.message);
}
