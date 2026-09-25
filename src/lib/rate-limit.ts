import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

/** Keyed hash of the visitor's IP, so the database never stores the IP. */
async function visitorId() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")
    .update(ip)
    .digest("base64url")
    .slice(0, 22);
}

/**
 * Counts one hit for this visitor under `scope` and returns false once there
 * were more than `max` within `windowSeconds`. Fails open if the check itself
 * errors, so a database hiccup doesn't hide contact buttons.
 */
export async function withinRateLimit(
  scope: string,
  max: number,
  windowSeconds: number,
) {
  const { data, error } = await createAdminClient().rpc("rate_limit_hit", {
    p_key: `${scope}:${await visitorId()}`,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("rate_limit_hit failed", error.message);
    return true;
  }
  return data;
}
