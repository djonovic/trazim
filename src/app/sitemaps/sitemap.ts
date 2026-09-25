import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { hreflang, routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";
import { getAllPriceStats } from "@/lib/queries/prices";
import { getTaxonomy, serviceSlug, type City } from "@/lib/queries/taxonomy";
import { SITE } from "@/lib/site";
import { publicDb, photoUrl } from "@/lib/supabase/public";
import { dbError } from "@/lib/supabase/errors";

// Sitemaps by page type (/sitemaps/sitemap/{id}.xml), listed in /sitemap.xml
// and robots.txt. Only indexable URLs: the same rules as the pages' noindex
// (combinations/services/cities with businesses, moderated profiles, prices
// with data). Every URL lists its other-language versions (hreflang).
export const SITEMAP_IDS = [
  "static",
  "services",
  "cities",
  "listings",
  "profiles",
  "prices",
] as const;
type SitemapId = (typeof SITEMAP_IDS)[number];

export const revalidate = 3600;

export async function generateSitemaps() {
  return SITEMAP_IDS.map((id) => ({ id }));
}

type Href = Parameters<typeof getPathname>[0]["href"];

const abs = (path: string) => new URL(path, siteUrl).toString();

/** One entry per locale, each listing all locales as alternates. */
function localized(
  href: Href | ((locale: Locale) => Href),
  extra: Omit<MetadataRoute.Sitemap[number], "url" | "alternates"> = {},
): MetadataRoute.Sitemap {
  const urls = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      abs(
        getPathname({
          locale,
          href: typeof href === "function" ? href(locale) : href,
        }),
      ),
    ]),
  ) as Record<Locale, string>;
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [hreflang[l], urls[l]]),
  );
  languages["x-default"] = urls[routing.defaultLocale];
  return routing.locales.map((locale) => ({
    ...extra,
    url: urls[locale],
    alternates: { languages },
  }));
}

/** Active businesses with what the sitemap needs, newest change first. */
async function activeBusinesses() {
  const { data, error } = await publicDb
    .from("businesses")
    .select(
      "id, slug, moderated_at, updated_at, business_services(service_id), business_cities(city_id), business_photos(storage_path, is_cover, sort_order)",
    )
    .eq("status", "active");
  if (error) throw dbError(error, "sitemap businesses");
  return data;
}

/** Same rule as getIndexability(): a settlement counts only its own businesses. */
function relatedIds(city: City, cities: City[]) {
  return city.parent_city_id
    ? [city.id]
    : [
        city.id,
        ...cities.filter((c) => c.parent_city_id === city.id).map((c) => c.id),
      ];
}

const latest = (dates: string[]) =>
  dates.length ? new Date(dates.reduce((a, b) => (a > b ? a : b))) : undefined;

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = (await props.id) as SitemapId;
  const { services, cities } = await getTaxonomy();

  switch (id) {
    case "static": {
      const pages: Href[] = [
        "/",
        "/usluge",
        "/gradovi",
        "/cijene",
        "/statistika",
        "/za-biznise",
        "/kako-funkcionise",
        "/kako-rangiramo",
        "/pomoc",
        "/bezbjednost",
        "/o-nama",
        "/kontakt",
        // Legal drafts stay noindex until a lawyer has reviewed them.
        ...(SITE.legalReviewed
          ? (["/uslovi", "/privatnost", "/kolacici"] as const)
          : []),
      ];
      return pages.flatMap((href) => localized(href));
    }

    case "services":
    case "cities":
    case "listings": {
      const businesses = await activeBusinesses();
      if (id === "services")
        return services.flatMap((service) => {
          const dates = businesses
            .filter((b) =>
              b.business_services.some((s) => s.service_id === service.id),
            )
            .map((b) => b.updated_at);
          return dates.length
            ? localized(
                (locale) => ({
                  pathname: "/usluge/[service]",
                  params: { service: serviceSlug(service, locale) },
                }),
                { lastModified: latest(dates) },
              )
            : [];
        });

      if (id === "cities")
        return cities.flatMap((city) => {
          const ids = relatedIds(city, cities);
          const dates = businesses
            .filter((b) =>
              b.business_cities.some((c) => ids.includes(c.city_id)),
            )
            .map((b) => b.updated_at);
          return dates.length
            ? localized(
                { pathname: "/gradovi/[city]", params: { city: city.slug } },
                { lastModified: latest(dates) },
              )
            : [];
        });

      // /{service}-{city}: every combination with at least one business.
      const byCombo = new Map<string, string[]>();
      for (const b of businesses)
        for (const { service_id } of b.business_services)
          for (const { city_id } of b.business_cities) {
            const key = `${service_id}:${city_id}`;
            byCombo.set(key, [...(byCombo.get(key) ?? []), b.updated_at]);
          }
      return services.flatMap((service) =>
        cities.flatMap((city) => {
          const dates = relatedIds(city, cities).flatMap(
            (cityId) => byCombo.get(`${service.id}:${cityId}`) ?? [],
          );
          return dates.length
            ? localized(
                (locale) => ({
                  pathname: "/[slug]",
                  params: {
                    slug: `${serviceSlug(service, locale)}-${city.slug}`,
                  },
                }),
                { lastModified: latest(dates) },
              )
            : [];
        }),
      );
    }

    case "profiles": {
      // Unmoderated profiles are noindex ("Na provjeri").
      const businesses = (await activeBusinesses()).filter(
        (b) => b.moderated_at,
      );
      return businesses.flatMap((b) =>
        localized(
          { pathname: "/b/[slug]", params: { slug: b.slug } },
          {
            lastModified: new Date(b.updated_at),
            images: [...b.business_photos]
              .sort(
                (x, y) =>
                  Number(y.is_cover) - Number(x.is_cover) ||
                  x.sort_order - y.sort_order,
              )
              .slice(0, 5)
              .map((p) => photoUrl(p.storage_path)),
          },
        ),
      );
    }

    case "prices": {
      const stats = await getAllPriceStats();
      const seen = new Set<string>();
      return stats.flatMap((stat) => {
        const service = services.find((s) => s.id === stat.service_id);
        const city = stat.city_key
          ? cities.find((c) => c.id === stat.city_key)
          : null;
        const key = `${stat.service_id}:${stat.city_key}`;
        if (!service || city === undefined || seen.has(key)) return [];
        seen.add(key);
        return localized((locale) => ({
          pathname: "/cijene/[slug]",
          params: {
            slug: city
              ? `${serviceSlug(service, locale)}-${city.slug}`
              : serviceSlug(service, locale),
          },
        }));
      });
    }
  }
  return [];
}
