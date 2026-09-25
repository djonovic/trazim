import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";
import type { Database } from "./database.types";

// Cookie-less anon client for public pages, so they can be statically
// rendered and cached. RLS still applies (anon role).
export const publicDb = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export function photoUrl(
  storagePath: string,
  bucket: "business-photos" | "review-photos" = "business-photos",
) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
}
