import "server-only";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { localeKey } from "@/lib/i18n-fields";
import type { Tables } from "@/lib/supabase/database.types";
import { dbError } from "@/lib/supabase/errors";
import { publicDb } from "@/lib/supabase/public";

export type City = Tables<"cities">;
export type Region = Tables<"regions">;
export type Service = Omit<
  Tables<"services">,
  | "search_text"
  | "description_me"
  | "description_en"
  | "description_ru"
  | "faq_me"
  | "faq_en"
  | "faq_ru"
  | "tips_me"
  | "tips_en"
  | "tips_ru"
>;
export type ServiceGroup = Tables<"service_groups"> & { services: Service[] };

// Without the long texts (description/FAQ/tips): with content for every
// service they'd push this cache entry over Next's 2 MB limit. Pages load a
// service's text with getServiceContent().
const SERVICE_COLUMNS =
  "id, group_id, slug_me, slug_en, slug_ru, name_me, name_en, name_ru, plural_gen_me, schema_type, price_unit_default, offers_online, sort_order, created_at";

// Taxonomy changes rarely; admins revalidate the "taxonomy" tag on edit.
const TAXONOMY = { tags: ["taxonomy"], revalidate: 86400 };

export const getTaxonomy = unstable_cache(
  async () => {
    const [groups, services, cities, regions] = await Promise.all([
      publicDb.from("service_groups").select("*").order("sort_order"),
      publicDb.from("services").select(SERVICE_COLUMNS).order("sort_order"),
      publicDb
        .from("cities")
        .select("*")
        .order("population", { ascending: false, nullsFirst: false }),
      publicDb.from("regions").select("*").order("sort_order"),
    ]);
    for (const r of [groups, services, cities, regions])
      if (r.error) throw dbError(r.error, "getTaxonomy");

    const allServices = services.data as Service[];
    return {
      groups: groups.data!.map((g) => ({
        ...g,
        services: allServices.filter((s) => s.group_id === g.id),
      })) as ServiceGroup[],
      services: allServices,
      cities: cities.data!,
      regions: regions.data!,
    };
  },
  ["taxonomy-v2"],
  TAXONOMY,
);

export function serviceSlug(service: Service, locale: Locale) {
  return service[`slug_${localeKey[locale]}`];
}

export async function getServiceBySlug(locale: Locale, slug: string) {
  const { services } = await getTaxonomy();
  return services.find((s) => serviceSlug(s, locale) === slug) ?? null;
}

export async function getCityBySlug(slug: string) {
  const { cities } = await getTaxonomy();
  return cities.find((c) => c.slug === slug) ?? null;
}

/**
 * Splits "/vodoinstalater-herceg-novi" into service + city. City slugs can
 * contain dashes, so try the longest matching city suffix first. The seed
 * generator guarantees every combination is unambiguous.
 */
export async function resolveServiceCity(locale: Locale, slug: string) {
  const { cities } = await getTaxonomy();
  const candidates = cities
    .filter((c) => slug.endsWith(`-${c.slug}`))
    .sort((a, b) => b.slug.length - a.slug.length);

  for (const city of candidates) {
    const service = await getServiceBySlug(
      locale,
      slug.slice(0, -city.slug.length - 1),
    );
    if (service) return { service, city };
  }
  return null;
}

/** The city plus its settlements (for a municipality) or its municipality (for a settlement). */
export async function relatedCityIds(city: City) {
  const { cities } = await getTaxonomy();
  if (city.parent_city_id) return [city.id, city.parent_city_id];
  return [
    city.id,
    ...cities.filter((c) => c.parent_city_id === city.id).map((c) => c.id),
  ];
}

export async function municipalities() {
  const { cities } = await getTaxonomy();
  return cities.filter((c) => !c.parent_city_id);
}

/** id → localized name lookups, passed to (client) cards. */
export async function nameMaps(locale: Locale) {
  const { services, cities } = await getTaxonomy();
  const key = localeKey[locale];
  return {
    serviceNames: Object.fromEntries(
      services.map((s) => [s.id, s[`name_${key}`]]),
    ) as Record<number, string>,
    cityNames: Object.fromEntries(
      cities.map((c) => [c.id, c[`name_${key}`]]),
    ) as Record<number, string>,
  };
}

/** "u Podgorici" (me), "Podgorica" (en/ru, where the message adds the preposition). */
export function cityLocative(city: City, locale: Locale) {
  return locale === "sr-Latn-ME"
    ? city.name_locative_me
    : city[`name_${localeKey[locale]}`];
}

/** " u Podgorici" / " in Podgorica" / " в г. Подгорица", for "Koliko košta X{city}?". */
export function cityPhrase(city: City | null, locale: Locale) {
  if (!city) return "";
  if (locale === "sr-Latn-ME") return ` ${city.name_locative_me}`;
  if (locale === "en") return ` in ${city.name_en}`;
  return ` в г. ${city.name_ru}`;
}

export type ServiceContent = {
  description: string | null;
  faq: { q: string; a: string }[];
  tips: string[];
};

/** Hand-written description, FAQ and tips of one service in one language. */
export const getServiceContent = unstable_cache(
  async (serviceId: number, locale: Locale): Promise<ServiceContent> => {
    const key = localeKey[locale];
    const { data, error } = await publicDb
      .from("services")
      .select(`description_${key}, faq_${key}, tips_${key}`)
      .eq("id", serviceId)
      .maybeSingle();
    if (error) throw dbError(error, "getServiceContent");
    const row = (data ?? {}) as Record<string, unknown>;
    return {
      description: (row[`description_${key}`] as string | null) ?? null,
      faq: (row[`faq_${key}`] as ServiceContent["faq"] | null) ?? [],
      tips: (row[`tips_${key}`] as string[] | null) ?? [],
    };
  },
  ["service-content-v1"],
  TAXONOMY,
);
