import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { dbError } from "@/lib/supabase/errors";
import { photoUrl } from "@/lib/supabase/public";

// Service-role reads for the admin area. Every caller must run requireAdmin()
// first; writes go through the admin's own session (see actions/admin.ts).

const PAGE_SIZE = 50;

export async function getAdminCounts() {
  const db = createAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
  const count = async (
    query: PromiseLike<{ count: number | null; error: unknown }>,
  ) => (await query).count ?? 0;
  const [pending, reports, reviews, sponsorships, businesses, users] =
    await Promise.all([
      count(
        db
          .from("businesses")
          .select("id", { count: "exact", head: true })
          .eq("status", "active")
          .is("moderated_at", null),
      ),
      count(
        db
          .from("reports")
          .select("id", { count: "exact", head: true })
          .eq("status", "open"),
      ),
      count(
        db
          .from("reviews")
          .select("id", { count: "exact", head: true })
          .gte("created_at", weekAgo),
      ),
      count(
        db
          .from("sponsorships")
          .select("id", { count: "exact", head: true })
          .eq("status", "active")
          .gte("ends_at", new Date().toISOString()),
      ),
      count(db.from("businesses").select("id", { count: "exact", head: true })),
      count(db.from("profiles").select("id", { count: "exact", head: true })),
    ]);
  return { pending, reports, reviews, sponsorships, businesses, users };
}

export type AdminBusinessFilter = "pending" | "all" | "verified" | "hidden";

export async function listAdminBusinesses(opts: {
  filter: AdminBusinessFilter;
  q?: string;
  page?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  let query = createAdminClient()
    .from("businesses")
    .select(
      "id, slug, name, status, moderated_at, verified_at, city_id, created_at, rating_count, phone",
      { count: "exact" },
    )
    .order("created_at", { ascending: opts.filter === "pending" })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (opts.filter === "pending")
    query = query.eq("status", "active").is("moderated_at", null);
  if (opts.filter === "verified") query = query.not("verified_at", "is", null);
  if (opts.filter === "hidden")
    query = query.in("status", ["rejected", "suspended"]);
  const q = opts.q?.trim();
  if (q) {
    const term = q.replace(/[%_,()]/g, " ");
    query = query.or(
      `name.ilike.%${term}%,slug.ilike.%${term}%,phone.ilike.%${term.replace(/\s/g, "")}%`,
    );
  }
  const { data, error, count } = await query;
  if (error) throw dbError(error, "listAdminBusinesses");
  return {
    rows: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

export async function getAdminBusiness(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const db = createAdminClient();
  const { data, error } = await db
    .from("businesses")
    .select(
      `*, business_services(service_id, is_primary), business_cities(city_id),
       business_photos(id, storage_path, is_cover, sort_order),
       owner:profiles!businesses_owner_id_fkey(id, full_name, created_at)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw dbError(error, "getAdminBusiness");
  if (!data) return null;

  const [ownerAuth, reports, sponsorships, log, reviews] = await Promise.all([
    data.owner_id
      ? db.auth.admin.getUserById(data.owner_id)
      : Promise.resolve(null),
    db
      .from("reports")
      .select("id, target, reason, details, status, created_at, review_id")
      .eq("business_id", id)
      .order("created_at", { ascending: false }),
    db
      .from("sponsorships")
      .select("*")
      .eq("business_id", id)
      .order("ends_at", { ascending: false }),
    db
      .from("admin_actions")
      .select("id, action, note, created_at, admin:profiles(full_name)")
      .eq("business_id", id)
      .order("created_at", { ascending: false })
      .limit(30),
    db
      .from("reviews")
      .select("id, status", { count: "exact" })
      .eq("business_id", id),
  ]);

  return {
    ...data,
    ownerEmail: ownerAuth?.data.user?.email ?? null,
    photos: [...data.business_photos]
      .sort(
        (a, b) =>
          Number(b.is_cover) - Number(a.is_cover) ||
          a.sort_order - b.sort_order,
      )
      .map((p) => ({ ...p, url: photoUrl(p.storage_path) })),
    reports: reports.data ?? [],
    sponsorships: sponsorships.data ?? [],
    log: log.data ?? [],
    reviewCount: reviews.count ?? 0,
  };
}

export type AdminReviewFilter = "published" | "hidden" | "all";

export async function listAdminReviews(opts: {
  filter: AdminReviewFilter;
  page?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  let query = createAdminClient()
    .from("reviews")
    .select(
      "id, rating, body, status, created_at, edited_at, reply_body, business:businesses(id, name, slug), author:profiles(full_name)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (opts.filter === "published") query = query.eq("status", "published");
  if (opts.filter === "hidden")
    query = query.in("status", ["hidden", "removed"]);
  const { data, error, count } = await query;
  if (error) throw dbError(error, "listAdminReviews");
  return {
    rows: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

export type AdminReportFilter = "open" | "closed";

export async function listAdminReports(filter: AdminReportFilter) {
  let query = createAdminClient()
    .from("reports")
    .select(
      `id, target, reason, details, status, created_at, resolved_at, resolution_note,
       business:businesses(id, name, slug, status),
       review:reviews(id, rating, body, status, author:profiles(full_name)),
       reporter:profiles!reports_reporter_id_fkey(full_name)`,
    )
    .order("created_at", { ascending: filter === "open" })
    .limit(100);
  query =
    filter === "open"
      ? query.eq("status", "open")
      : query.in("status", ["resolved", "dismissed"]);
  const { data, error } = await query;
  if (error) throw dbError(error, "listAdminReports");
  return data;
}

export async function listAdminSponsorships() {
  const { data, error } = await createAdminClient()
    .from("sponsorships")
    .select("*, business:businesses(id, name, slug)")
    .order("ends_at", { ascending: false })
    .limit(200);
  if (error) throw dbError(error, "listAdminSponsorships");
  return data;
}

export async function listAdminLog(limit = 20) {
  const { data, error } = await createAdminClient()
    .from("admin_actions")
    .select(
      "id, action, note, created_at, admin:profiles(full_name), business:businesses(id, name)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw dbError(error, "listAdminLog");
  return data;
}

export async function listAdminInquiries() {
  const { data, error } = await createAdminClient()
    .from("inquiries")
    .select(
      "id, service_id, city_id, body, phone, urgent, status, created_at, business:businesses(id, name), author:profiles(full_name), inquiry_reveals(business_id)",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw dbError(error, "listAdminInquiries");
  return data;
}

export async function listAdminBanners() {
  const { data, error } = await createAdminClient()
    .from("banners")
    .select("*")
    .order("ends_at", { ascending: false })
    .limit(200);
  if (error) throw dbError(error, "listAdminBanners");
  return data;
}
