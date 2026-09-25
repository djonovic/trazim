import "server-only";
import type { Locale } from "@/i18n/routing";
import { localeKey } from "@/lib/i18n-fields";
import { listBusinessCards } from "@/lib/queries/businesses";
import {
  getTaxonomy,
  relatedCityIds,
  type City,
  type Service,
} from "@/lib/queries/taxonomy";
import { dbError } from "@/lib/supabase/errors";
import { publicDb } from "@/lib/supabase/public";

export type SearchFilter = "openNow" | "emergency" | "online";
export const SEARCH_FILTERS: SearchFilter[] = [
  "openNow",
  "emergency",
  "online",
];

/** Same normalization as search_normalize() in SQL. */
export const normalize = (s: string) =>
  s
    .replace(/đ/g, "dj")
    .replace(/Đ/g, "Dj")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export type SearchParams = {
  q: string;
  city: City | null;
  groupId: number | null;
};

/**
 * A service whose name or slug is exactly the query (in any language), so the
 * search can go straight to its listing page.
 */
export async function exactService(q: string, groupId: number | null) {
  const term = normalize(q);
  if (!term) return null;
  const { services } = await getTaxonomy();
  return (
    services.find(
      (s) =>
        (groupId == null || s.group_id === groupId) &&
        [s.name_me, s.name_en, s.name_ru, s.slug_me, s.slug_en, s.slug_ru].some(
          (v) =>
            normalize(v) === term || normalize(v).replace(/-/g, " ") === term,
        ),
    ) ?? null
  );
}

/**
 * Businesses matching the search bar: the text matches a service they offer
 * or their own name/description; optionally in a city (with its settlements)
 * and a category.
 */
export async function searchBusinesses(
  { q, city, groupId }: SearchParams,
  locale: Locale,
) {
  const { services } = await getTaxonomy();
  const groupServiceIds = groupId
    ? services.filter((s) => s.group_id === groupId).map((s) => s.id)
    : null;
  const cityIds = city ? await relatedCityIds(city) : undefined;

  let matchedServices: Service[] = [];
  let businessIds: string[] | undefined;

  if (q.trim()) {
    const [serviceHits, nameHits] = await Promise.all([
      publicDb.rpc("search_services", { q, max_results: 8 }),
      publicDb.rpc("search_business_ids", { q, max_results: 200 }),
    ]);
    if (serviceHits.error) throw dbError(serviceHits.error, "search_services");
    if (nameHits.error) throw dbError(nameHits.error, "search_business_ids");

    matchedServices = serviceHits.data
      .map((hit) => services.find((s) => s.id === hit.id))
      .filter((s): s is Service => s != null)
      .filter((s) => !groupServiceIds || groupServiceIds.includes(s.id));

    const offering = matchedServices.length
      ? await publicDb
          .from("business_services")
          .select("business_id")
          .in(
            "service_id",
            matchedServices.map((s) => s.id),
          )
          .limit(1000)
      : { data: [], error: null };
    if (offering.error) throw dbError(offering.error, "searchBusinesses");

    businessIds = [
      ...new Set([
        ...nameHits.data.map((r) => r.id),
        ...offering.data.map((r) => r.business_id),
      ]),
    ].slice(0, 200); // keeps the id list within URL limits
    if (!businessIds.length) return { businesses: [], matchedServices };
  }

  const businesses = await listBusinessCards({
    ids: businessIds,
    cityIds,
    serviceIds: groupServiceIds ?? undefined,
  });

  // Put the service that matched first on the cards (and its price).
  const key = localeKey[locale];
  matchedServices.sort(
    (a, b) =>
      Number(normalize(b[`name_${key}`]).startsWith(normalize(q))) -
      Number(normalize(a[`name_${key}`]).startsWith(normalize(q))),
  );
  return { businesses, matchedServices };
}
