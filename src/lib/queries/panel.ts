import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { photoUrl } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

/** The owner's businesses with 30-day view and contact totals. Reads through RLS. */
export async function getMyBusinesses(userId: string) {
  const supabase = await createClient();
  const since = new Date(Date.now() - 30 * 86400_000)
    .toISOString()
    .slice(0, 10);
  const { data: businesses } = await supabase
    .from("businesses")
    .select(
      "id, slug, name, status, moderated_at, verified_at, rating_avg, rating_count, city_id, created_at",
    )
    .eq("owner_id", userId)
    .order("created_at");
  // Only this user's businesses: for an admin, RLS would return every row.
  const { data: stats } = businesses?.length
    ? await supabase
        .from("business_daily_stats")
        .select("*")
        .in(
          "business_id",
          businesses.map((b) => b.id),
        )
        .gte("day", since)
    : { data: [] };
  return (businesses ?? []).map((b) => {
    const rows = (stats ?? []).filter((s) => s.business_id === b.id);
    const sum = (key: keyof (typeof rows)[number]) =>
      rows.reduce((n, r) => n + Number(r[key] ?? 0), 0);
    return {
      ...b,
      views30: sum("views"),
      contacts30:
        sum("contact_phone") +
        sum("contact_viber") +
        sum("contact_whatsapp") +
        sum("contact_email") +
        sum("contact_website"),
    };
  });
}

/**
 * Full business for the editor, including contact columns that the public
 * API can't read. Ownership is checked in the query itself.
 */
export async function getOwnedBusiness(id: string, userId: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await createAdminClient()
    .from("businesses")
    .select(
      `id, slug, name, description, phone, viber, whatsapp, email, website, instagram, address,
       city_id, status, moderated_at, moderation_note, verified_at, offers_online, emergency_24h, languages,
       business_services(service_id, is_primary), business_cities(city_id),
       business_hours(weekday, opens_at, closes_at),
       business_photos(id, storage_path, is_cover, sort_order),
       price_list_items(id, service_id, name, kind, price_from, price_to, unit, sort_order),
       reviews(id, rating, body, status, created_at, edited_at, reply_body, profiles(full_name))`,
    )
    .eq("id", id)
    .eq("owner_id", userId)
    .maybeSingle();
  if (!data) return null;
  return {
    ...data,
    business_photos: [...data.business_photos]
      .sort(
        (a, b) =>
          Number(b.is_cover) - Number(a.is_cover) ||
          a.sort_order - b.sort_order,
      )
      .map((p) => ({ ...p, url: photoUrl(p.storage_path) })),
    price_list_items: [...data.price_list_items].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
    reviews: [...data.reviews].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    ),
  };
}

export type OwnedBusiness = NonNullable<
  Awaited<ReturnType<typeof getOwnedBusiness>>
>;

/**
 * Approved requests from the last 30 days that the signed-in owner may see
 * (RLS: matching service + town, or sent to one of their businesses), plus
 * which of them this business already opened.
 */
export async function listRecentInquiries(businessId: string) {
  const supabase = await createClient();
  const since = new Date(Date.now() - 30 * 86400_000).toISOString();
  const [{ data: rows }, { data: reveals }] = await Promise.all([
    supabase
      .from("inquiries")
      .select(
        "id, service_id, city_id, body, urgent, preferred_time, created_at, business_id",
      )
      .eq("status", "approved")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("inquiry_reveals")
      .select("inquiry_id")
      .eq("business_id", businessId),
  ]);
  return {
    rows: rows ?? [],
    reveals: (reveals ?? []).map((r) => r.inquiry_id),
  };
}
