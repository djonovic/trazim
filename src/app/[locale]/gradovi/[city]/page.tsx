import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ResultsList } from "@/components/business/results-list";
import { BusinessGrid } from "@/components/business/business-grid";
import { ReviewList } from "@/components/business/review-list";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Section } from "@/components/common/section";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { POPULAR_SERVICE_SLUGS } from "@/lib/popular";
import {
  listBusinesses,
  listRecentReviews,
  listSponsored,
} from "@/lib/queries/businesses";
import {
  cityLocative,
  cityPhrase,
  getCityBySlug,
  getTaxonomy,
  nameMaps,
  relatedCityIds,
  serviceSlug,
} from "@/lib/queries/taxonomy";
import { getIndexability } from "@/lib/seo/indexable";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { localePaths, pageMetadata } from "@/lib/seo/metadata";
import { SPONSOR_SLOTS } from "@/lib/site";
import { BannerLayout } from "@/components/layout/banner-layout";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { cities } = await getTaxonomy();
  return cities.map((c) => ({ city: c.slug }));
}

async function load(slug: string) {
  const city = await getCityBySlug(slug);
  if (!city) notFound();
  const businesses = await listBusinesses({
    cityIds: await relatedCityIds(city),
  });
  return { city, businesses };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gradovi/[city]">) {
  const { locale: raw, city: slug } = await params;
  const locale = raw as Locale;
  const { city, businesses } = await load(slug);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    image: false,
    locale,
    paths: localePaths({ pathname: "/gradovi/[city]", params: { city: slug } }),
    title: t("cityTitle", {
      // "u Podgorici" / "in Podgorica" / "в г. Подгорица"
      locative: cityPhrase(city, locale).trim(),
      count: businesses.length,
    }),
    description: t("cityDescription", { locative: cityLocative(city, locale) }),
    // Settlements: only when a business lists them itself (see getIndexability).
    noindex: !(await getIndexability()).city(city),
  });
}

export default async function CityPage({
  params,
}: PageProps<"/[locale]/gradovi/[city]">) {
  const { locale: raw, city: slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const { city, businesses } = await load(slug);
  const t = await getTranslations({ locale, namespace: "Cities" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const tf = await getTranslations({ locale, namespace: "Footer" });
  const { services } = await getTaxonomy();
  const indexable = await getIndexability();
  const { cityNames, serviceNames } = await nameMaps(locale);
  const [sponsored, reviews] = await Promise.all([
    listSponsored({ cityId: city.id, limit: SPONSOR_SLOTS.page }),
    listRecentReviews({ businessIds: businesses.map((b) => b.id), limit: 6 }),
  ]);
  const path = (href: Parameters<typeof getPathname>[0]["href"]) =>
    getPathname({ locale, href });
  const name = tr(city, "name", locale);
  const locative = cityLocative(city, locale);

  // Services offered here, most businesses first (links only to
  // combinations that have businesses; the rest are noindex).
  const popular = services
    .filter((s) => indexable.combo(s.id, city))
    .sort(
      (a, b) =>
        indexable.comboCount(b.id, city.id) -
          indexable.comboCount(a.id, city.id) ||
        (POPULAR_SERVICE_SLUGS.indexOf(a.slug_me) + 1 || 999) -
          (POPULAR_SERVICE_SLUGS.indexOf(b.slug_me) + 1 || 999),
    )
    .slice(0, 16);

  const crumbs = [
    { name: tc("siteName"), href: path("/") },
    { name: tf("cities"), href: path("/gradovi") },
    {
      name,
      href: path({ pathname: "/gradovi/[city]", params: { city: slug } }),
    },
  ];

  return (
    <BannerLayout
      locale={locale}
      className="space-y-12 py-8"
      banner={{
        candidates: [
          { scope: "city", id: city.id },
          ...(city.parent_city_id
            ? [{ scope: "city" as const, id: city.parent_city_id }]
            : []),
        ],
        offer: { scope: "city", name: cityPhrase(city, locale).trim() },
      }}
    >
      <SetAlternates
        paths={localePaths({
          pathname: "/gradovi/[city]",
          params: { city: slug },
        })}
      />
      <JsonLd
        graph={[
          {
            "@type": "City",
            name: city.name_me,
            alternateName: [city.name_en, city.name_ru],
            containedInPlace: { "@type": "Country", name: "Montenegro" },
            ...(city.lat && city.lng
              ? {
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: city.lat,
                    longitude: city.lng,
                  },
                }
              : {}),
          },
          breadcrumbList(crumbs),
        ]}
      />
      <header className="space-y-3">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {name}
        </h1>
        <p className="text-muted-foreground">
          {tc("profiles", { count: businesses.length })}
        </p>
      </header>

      {popular.length > 0 && (
        <Section title={t("popularIn", { locative })}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {popular.map((s) => (
              <li key={s.id}>
                <a
                  href={path({
                    pathname: "/[slug]",
                    params: { slug: `${serviceSlug(s, locale)}-${city.slug}` },
                  })}
                  className="flex h-14 items-center justify-between gap-2 rounded-xl border bg-white px-4 font-semibold hover:border-primary/40"
                >
                  <span className="truncate">{tr(s, "name", locale)}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {indexable.comboCount(s.id, city.id)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {sponsored.length > 0 && (
        <Section title={tc("sponsored")}>
          <BusinessGrid
            businesses={sponsored}
            cityNames={cityNames}
            serviceNames={serviceNames}
            sponsored
          />
        </Section>
      )}

      {businesses.length > 0 && (
        <Section title={t("allIn", { locative })}>
          {/* Top 60 here; the rest are on the per-city listings. */}
          <ResultsList
            businesses={businesses.slice(0, 60)}
            cityNames={cityNames}
            serviceNames={serviceNames}
            page={1}
            pageSize={60}
            pageHrefs={[
              path({ pathname: "/gradovi/[city]", params: { city: slug } }),
            ]}
          />
        </Section>
      )}

      {reviews.length > 0 && (
        <Section title={tc("reviews", { count: reviews.length })}>
          <ReviewList reviews={reviews} showBusiness cityNames={cityNames} />
        </Section>
      )}
    </BannerLayout>
  );
}
