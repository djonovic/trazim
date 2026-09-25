import "server-only";
import { unstable_cache } from "next/cache";
import type { Tables } from "@/lib/supabase/database.types";
import { dbError } from "@/lib/supabase/errors";
import { supabaseUrl } from "@/lib/env";
import { photoUrl, publicDb } from "@/lib/supabase/public";

// Business data is revalidated hourly, and immediately via revalidateTag
// ("businesses", "business:{id}") when an owner or admin edits a profile.
const HOUR = 3600;

const CARD_COLUMNS = `
  id, slug, name, description, city_id, verified_at, moderated_at, created_at,
  offers_online, emergency_24h, response_time_bucket, views_count, rating_avg, rating_count,
  business_services!inner(service_id, is_primary),
  business_cities!inner(city_id),
  business_photos(storage_path, is_cover, sort_order),
  business_hours(weekday, opens_at, closes_at),
  price_list_items(service_id, kind, price_from)
`;

type CardRow = Pick<
  Tables<"businesses">,
  | "id"
  | "slug"
  | "name"
  | "description"
  | "city_id"
  | "verified_at"
  | "moderated_at"
  | "created_at"
  | "offers_online"
  | "emergency_24h"
  | "response_time_bucket"
  | "views_count"
  | "rating_avg"
  | "rating_count"
> & {
  business_services: { service_id: number; is_primary: boolean }[];
  business_cities: { city_id: number }[];
  business_photos: {
    storage_path: string;
    is_cover: boolean;
    sort_order: number;
  }[];
  business_hours: { weekday: number; opens_at: string; closes_at: string }[];
  price_list_items: {
    service_id: number | null;
    kind: string;
    price_from: number | null;
  }[];
};

export type BusinessCard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cityId: number;
  serviceIds: number[];
  coverUrl: string | null;
  verified: boolean;
  underReview: boolean;
  isNew: boolean;
  online: boolean;
  emergency: boolean;
  responseTime: Tables<"businesses">["response_time_bucket"];
  views: number;
  rating: number;
  ratingCount: number;
  /** Lowest "from" price for the listed service (or overall), in EUR. */
  priceFrom: number | null;
  hours: { weekday: number; opensAt: string; closesAt: string }[];
};

const NEW_DAYS = 30;

function toCard(row: CardRow, serviceId?: number): BusinessCard {
  const cover =
    row.business_photos.find((p) => p.is_cover) ??
    [...row.business_photos].sort((a, b) => a.sort_order - b.sort_order)[0];
  const prices = row.price_list_items
    .filter(
      (p) =>
        p.price_from != null &&
        (serviceId == null || p.service_id === serviceId),
    )
    .map((p) => Number(p.price_from));
  // Primary services first, then the rest.
  const serviceIds = [...row.business_services]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    .map((s) => s.service_id);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    cityId: row.city_id,
    serviceIds,
    coverUrl: cover ? photoUrl(cover.storage_path) : null,
    verified: row.verified_at != null,
    underReview: row.moderated_at == null,
    isNew:
      Date.now() - new Date(row.created_at).getTime() < NEW_DAYS * 86400_000,
    online: row.offers_online,
    emergency: row.emergency_24h,
    responseTime: row.response_time_bucket,
    views: row.views_count,
    rating: Number(row.rating_avg),
    ratingCount: row.rating_count,
    priceFrom: prices.length ? Math.min(...prices) : null,
    hours: row.business_hours.map((h) => ({
      weekday: h.weekday,
      opensAt: h.opens_at,
      closesAt: h.closes_at,
    })),
  };
}

/** Default "Preporučeno" order: verified first, then Bayesian rating, then views. */
export function recommendedScore(b: BusinessCard) {
  const prior = 4;
  const weight = 3;
  const bayes =
    (b.rating * b.ratingCount + prior * weight) / (b.ratingCount + weight);
  return (b.verified ? 1 : 0) * 10 + bayes + Math.log10(1 + b.views) * 0.3;
}

const byRecommended = (a: BusinessCard, b: BusinessCard) =>
  recommendedScore(b) - recommendedScore(a);

/** Businesses offering a service in any of the given cities (their service area). */
export const listBusinesses = unstable_cache(
  async (opts: { serviceId?: number; cityIds?: number[]; limit?: number }) => {
    let query = publicDb
      .from("businesses")
      .select(CARD_COLUMNS)
      .eq("status", "active");
    if (opts.serviceId)
      query = query.eq("business_services.service_id", opts.serviceId);
    if (opts.cityIds?.length)
      query = query.in("business_cities.city_id", opts.cityIds);

    const { data, error } = await query.limit(opts.limit ?? 300);
    if (error) throw dbError(error, "listBusinesses");
    return (data as unknown as CardRow[])
      .map((r) => toCard(r, opts.serviceId))
      .sort(byRecommended);
  },
  ["list-businesses-v1"],
  { tags: ["businesses"], revalidate: HOUR },
);

/**
 * Cards for search results: optional id list (text matches), cities and
 * services. Not cached, since every query is different.
 */
export async function listBusinessCards(opts: {
  ids?: string[];
  cityIds?: number[];
  serviceIds?: number[];
}) {
  let query = publicDb
    .from("businesses")
    .select(CARD_COLUMNS)
    .eq("status", "active");
  if (opts.ids) query = query.in("id", opts.ids);
  if (opts.serviceIds)
    query = query.in("business_services.service_id", opts.serviceIds);
  if (opts.cityIds?.length)
    query = query.in("business_cities.city_id", opts.cityIds);

  const { data, error } = await query.limit(300);
  if (error) throw dbError(error, "listBusinessCards");
  return (data as unknown as CardRow[])
    .map((r) => toCard(r))
    .sort(byRecommended);
}

/**
 * Sponsored businesses for a placement. A service + city sponsorship also
 * shows on that city's page and that service's page; the exact placement
 * comes first (service_city → service on listings, city → service_city on
 * city pages).
 */
export const listSponsored = unstable_cache(
  async (opts: { serviceId?: number; cityId?: number; limit?: number }) => {
    const { data, error } = await publicDb
      .from("sponsorships")
      .select("business_id, scope, service_id, city_id, starts_at")
      .eq("status", "active")
      .lte("starts_at", new Date().toISOString())
      .gte("ends_at", new Date().toISOString());
    if (error) throw dbError(error, "listSponsored");

    // Lower rank = shown first; null = not shown here.
    const rank = (s: (typeof data)[number]) => {
      if (opts.serviceId && opts.cityId) {
        if (
          s.scope === "service_city" &&
          s.service_id === opts.serviceId &&
          s.city_id === opts.cityId
        )
          return 0;
        if (s.scope === "service" && s.service_id === opts.serviceId) return 1;
        return null;
      }
      if (opts.serviceId) {
        if (s.scope === "service" && s.service_id === opts.serviceId) return 0;
        if (s.scope === "service_city" && s.service_id === opts.serviceId)
          return 1;
        return null;
      }
      if (opts.cityId) {
        if (s.scope === "city" && s.city_id === opts.cityId) return 0;
        if (s.scope === "service_city" && s.city_id === opts.cityId) return 1;
        return null;
      }
      return s.scope === "home" ? 0 : null;
    };
    const matches = data
      .map((s) => ({ ...s, rank: rank(s) }))
      .filter((s) => s.rank != null)
      .sort(
        (a, b) => a.rank! - b.rank! || a.starts_at.localeCompare(b.starts_at),
      );
    const ids = [...new Set(matches.map((s) => s.business_id))].slice(
      0,
      opts.limit ?? 8,
    );
    if (!ids.length) return [];

    const cards = await publicDb
      .from("businesses")
      .select(CARD_COLUMNS.replace(/!inner/g, ""))
      .in("id", ids)
      .eq("status", "active");
    if (cards.error) throw dbError(cards.error, "listSponsored");
    return (cards.data as unknown as CardRow[])
      .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
      .map((r) => toCard(r, opts.serviceId));
  },
  ["list-sponsored-v2"],
  { tags: ["businesses", "sponsorships"], revalidate: HOUR },
);

export type ReviewItem = {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  editedAt: string | null;
  reply: string | null;
  author: string;
  business?: { slug: string; name: string; cityId: number };
  photos: { id: string; url: string }[];
};

// Reviewer names come from profiles, which RLS hides from anon; read them
// through a narrow view-like select on the reviews side only (first name + initial).
export function shortName(fullName: string | null | undefined) {
  if (!fullName) return "Korisnik";
  const [first, last] = fullName.trim().split(/\s+/);
  return last ? `${first} ${last[0]}.` : first;
}

export const listRecentReviews = unstable_cache(
  async (opts: { businessIds?: string[]; limit?: number }) => {
    let query = publicDb
      .from("public_reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(opts.limit ?? 6);
    if (opts.businessIds) {
      if (!opts.businessIds.length) return [];
      query = query.in("business_id", opts.businessIds);
    }
    const { data, error } = await query;
    if (error) throw dbError(error, "listRecentReviews");
    const { data: photos, error: photoError } = data.length
      ? await publicDb
          .from("review_photos")
          .select("id, review_id, storage_path, sort_order")
          .in(
            "review_id",
            data.map((r) => r.id!),
          )
          .order("sort_order")
      : { data: [], error: null };
    if (photoError) throw dbError(photoError, "listRecentReviews photos");
    return data.map((r): ReviewItem => ({
      photos: photos
        .filter((p) => p.review_id === r.id)
        .map((p) => ({
          id: p.id,
          url: photoUrl(p.storage_path, "review-photos"),
        })),
      id: r.id!,
      rating: r.rating!,
      body: r.body,
      createdAt: r.created_at!,
      editedAt: r.edited_at,
      reply: r.reply_body,
      author: shortName(r.author_name),
      business: {
        slug: r.business_slug!,
        name: r.business_name!,
        cityId: r.business_city_id!,
      },
    }));
  },
  ["recent-reviews-v2"],
  { tags: ["reviews"], revalidate: HOUR },
);

export const getBusinessProfile = unstable_cache(
  async (slug: string) => {
    const { data, error } = await publicDb
      .from("businesses")
      .select(
        `id, owner_id, slug, name, description, website, instagram, address, city_id, lat, lng,
         moderated_at, verified_at, offers_online, emergency_24h, languages,
         response_time_bucket, views_count, rating_avg, rating_count, created_at, updated_at,
         business_services(service_id, is_primary), business_cities(city_id),
         business_photos(id, storage_path, width, height, is_cover, sort_order),
         business_hours(weekday, opens_at, closes_at),
         price_list_items(id, service_id, name, kind, price_from, price_to, unit, sort_order)`,
      )
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw dbError(error, "getBusinessProfile");
    if (!data) return null;

    const { data: channels } = await publicDb
      .from("business_contact_channels")
      .select("has_phone, has_viber, has_whatsapp, has_email")
      .eq("business_id", data.id)
      .maybeSingle();

    return {
      ...data,
      channels: {
        phone: Boolean(channels?.has_phone),
        viber: Boolean(channels?.has_viber || channels?.has_phone),
        whatsapp: Boolean(channels?.has_whatsapp || channels?.has_phone),
        email: Boolean(channels?.has_email),
      },
      photos: [...data.business_photos]
        .sort(
          (a, b) =>
            Number(b.is_cover) - Number(a.is_cover) ||
            a.sort_order - b.sort_order,
        )
        .map((p) => ({ ...p, url: photoUrl(p.storage_path) })),
      priceList: [...data.price_list_items].sort(
        (a, b) => a.sort_order - b.sort_order,
      ),
    };
  },
  ["business-profile-v2"],
  { tags: ["businesses"], revalidate: HOUR },
);

export type BusinessProfile = NonNullable<
  Awaited<ReturnType<typeof getBusinessProfile>>
>;

export const getSiteStats = unstable_cache(
  async () => {
    const { count, error } = await publicDb
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("status", "active");
    if (error) throw dbError(error, "getSiteStats");
    return { businesses: count ?? 0 };
  },
  ["site-stats-v1"],
  { tags: ["businesses"], revalidate: HOUR },
);

/** Business counts per service (all of Montenegro) and per service × city. */
export const getCoverage = unstable_cache(
  async () => {
    const { data, error } = await publicDb
      .from("businesses")
      .select("id, business_services(service_id), business_cities(city_id)")
      .eq("status", "active");
    if (error) throw dbError(error, "getCoverage");

    const perService: Record<number, number> = {};
    const perServiceCity: Record<string, number> = {};
    const perCity: Record<number, number> = {};
    for (const b of data) {
      const cities = new Set(b.business_cities.map((c) => c.city_id));
      for (const c of cities) perCity[c] = (perCity[c] ?? 0) + 1;
      for (const { service_id } of b.business_services) {
        perService[service_id] = (perService[service_id] ?? 0) + 1;
        for (const c of cities) {
          const key = `${service_id}:${c}`;
          perServiceCity[key] = (perServiceCity[key] ?? 0) + 1;
        }
      }
    }
    return { perService, perServiceCity, perCity };
  },
  ["coverage-v1"],
  { tags: ["businesses"], revalidate: HOUR },
);

export type ActiveBanner = {
  id: string;
  advertiser: string;
  title: string;
  body: string | null;
  cta: string | null;
  color: string;
  logoUrl: string | null;
  host: string;
};

/** The running banner of one placement (home, a service or a town), if booked. */
export const getActiveBanner = unstable_cache(
  async (
    scope: "home" | "service" | "city",
    targetId: number | null,
  ): Promise<ActiveBanner | null> => {
    const now = new Date().toISOString();
    let query = publicDb
      .from("banners")
      .select("id, advertiser, title, body, cta, color, logo_path, link_url")
      .eq("scope", scope)
      .eq("status", "active")
      .lte("starts_at", now)
      .gte("ends_at", now);
    if (scope === "service") query = query.eq("service_id", targetId!);
    if (scope === "city") query = query.eq("city_id", targetId!);
    const { data, error } = await query
      .order("starts_at")
      .limit(1)
      .maybeSingle();
    if (error) throw dbError(error, "getActiveBanner");
    if (!data) return null;
    return {
      id: data.id,
      advertiser: data.advertiser,
      title: data.title,
      body: data.body,
      cta: data.cta,
      color: data.color,
      logoUrl: data.logo_path
        ? `${supabaseUrl}/storage/v1/object/public/banners/${data.logo_path}`
        : null,
      host: new URL(data.link_url).hostname.replace(/^www\./, ""),
    };
  },
  ["active-banner-v2"],
  { tags: ["banners"], revalidate: HOUR },
);
