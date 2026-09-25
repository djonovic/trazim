import { Info } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BusinessGrid } from "@/components/business/business-grid";
import { ResultsList } from "@/components/business/results-list";
import { ReviewList } from "@/components/business/review-list";
import { Rating } from "@/components/business/rating";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Faq, type FaqItem } from "@/components/common/faq";
import { LinkGrid, Section } from "@/components/common/section";
import { InquiryButton } from "@/components/inquiries/inquiry-button";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { countPhraseMe, formatEur } from "@/lib/format";
import { tr } from "@/lib/i18n-fields";
import {
  getCoverage,
  listBusinesses,
  listRecentReviews,
  listSponsored,
  type BusinessCard,
} from "@/lib/queries/businesses";
import { getPriceStats, pickPriceStat } from "@/lib/queries/prices";
import {
  cityLocative,
  cityPhrase,
  getServiceContent,
  getTaxonomy,
  nameMaps,
  relatedCityIds,
  resolveServiceCity,
  serviceSlug,
  type City,
  type Service,
} from "@/lib/queries/taxonomy";
import { breadcrumbList, businessItemList, faqPage } from "@/lib/seo/jsonld";
import { getIndexability } from "@/lib/seo/indexable";
import { localePaths, pageMetadata } from "@/lib/seo/metadata";
import { SPONSOR_SLOTS } from "@/lib/site";
import { BannerLayout } from "@/components/layout/banner-layout";

export const PAGE_SIZE = 20;
const MIN_LOCAL_RESULTS = 3;

const comboHref = (service: Service, city: City) => (locale: Locale) => ({
  pathname: "/[slug]" as const,
  params: { slug: `${serviceSlug(service, locale)}-${city.slug}` },
});

const pageHref =
  (service: Service, city: City, page: number) => (locale: Locale) =>
    page === 1
      ? comboHref(service, city)(locale)
      : {
          pathname: "/[slug]/[page]" as const,
          params: {
            slug: `${serviceSlug(service, locale)}-${city.slug}`,
            page: String(page),
          },
        };

async function loadListing(locale: Locale, slug: string) {
  const match = await resolveServiceCity(locale, slug);
  if (!match) notFound();
  const { service, city } = match;

  const businesses = await listBusinesses({
    serviceId: service.id,
    cityIds: await relatedCityIds(city),
  });
  return { service, city, businesses };
}

/** "12 vodoinstalatera" (me) or "12 profiles" (en/ru). */
async function countPhrase(locale: Locale, service: Service, count: number) {
  const t = await getTranslations({ locale, namespace: "Common" });
  const me =
    locale === "sr-Latn-ME"
      ? countPhraseMe(count, service.name_me, service.plural_gen_me)
      : null;
  return me ?? t("profiles", { count });
}

export async function listingMetadata(
  locale: Locale,
  slug: string,
  page: number,
): Promise<Metadata> {
  const { service, city, businesses } = await loadListing(locale, slug);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const serviceName = tr(service, "name", locale);
  const cityName = tr(city, "name", locale);

  const rated = businesses.filter((b) => b.ratingCount > 0);
  const reviews = rated.reduce((n, b) => n + b.ratingCount, 0);
  const avg = reviews
    ? rated.reduce((n, b) => n + b.rating * b.ratingCount, 0) / reviews
    : 0;

  return pageMetadata({
    locale,
    paths: localePaths(pageHref(service, city, page)),
    title:
      page === 1
        ? t("listingTitle", { service: serviceName, city: cityName })
        : t("listingTitlePage", { service: serviceName, city: cityName, page }),
    description: t("listingDescription", {
      count: await countPhrase(locale, service, businesses.length),
      city: cityLocative(city, locale),
      rating: reviews
        ? t("listingRating", { rating: avg.toFixed(1), count: reviews })
        : "",
    }),
    // Thin-content guard: only index combinations that have real businesses
    // (for a settlement, businesses that list it themselves).
    noindex: !(await getIndexability()).combo(service.id, city),
    // Page 1 has its own image file; later pages reuse it.
    image: page === 1 ? false : `/${locale}/${slug}/opengraph-image`,
  });
}

export async function ListingPage({
  locale,
  slug,
  page,
}: {
  locale: Locale;
  slug: string;
  page: number;
}) {
  const { service, city, businesses } = await loadListing(locale, slug);
  const pageCount = Math.max(1, Math.ceil(businesses.length / PAGE_SIZE));
  if (page > pageCount) notFound();

  const t = await getTranslations({ locale, namespace: "Listing" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const tu = await getTranslations({ locale, namespace: "Units" });
  const { cities, regions, services, groups } = await getTaxonomy();
  const { cityNames, serviceNames } = await nameMaps(locale);

  const serviceName = tr(service, "name", locale);
  const cityName = tr(city, "name", locale);
  const locative = cityLocative(city, locale);
  const path = (href: Parameters<typeof getPathname>[0]["href"]) =>
    getPathname({ locale, href });

  const [sponsored, reviews, priceStats, indexable] = await Promise.all([
    listSponsored({
      serviceId: service.id,
      cityId: city.id,
      limit: SPONSOR_SLOTS.page,
    }),
    listRecentReviews({ businessIds: businesses.map((b) => b.id), limit: 6 }),
    getPriceStats(service.id),
    getIndexability(),
  ]);

  // Too few local results: fill in from the same region, then online providers.
  let nearby: BusinessCard[] = [];
  let online: BusinessCard[] = [];
  if (businesses.length < MIN_LOCAL_RESULTS) {
    const seen = new Set(businesses.map((b) => b.id));
    const regionCityIds = cities
      .filter((c) => c.region_id === city.region_id)
      .map((c) => c.id);
    nearby = (
      await listBusinesses({ serviceId: service.id, cityIds: regionCityIds })
    )
      .filter((b) => !seen.has(b.id))
      .slice(0, 6);
    nearby.forEach((b) => seen.add(b.id));
    online = (await listBusinesses({ serviceId: service.id }))
      .filter((b) => b.online && !seen.has(b.id))
      .slice(0, 6);
  }
  const region = regions.find((r) => r.id === city.region_id)!;

  const rated = businesses.filter((b) => b.ratingCount > 0);
  const reviewCount = rated.reduce((n, b) => n + b.ratingCount, 0);
  const ratingAvg = reviewCount
    ? rated.reduce((n, b) => n + b.rating * b.ratingCount, 0) / reviewCount
    : 0;

  // FAQ: hand-written per service + generated from live data.
  const price =
    pickPriceStat(priceStats, city.id) ?? pickPriceStat(priceStats, 0);
  const count = await countPhrase(locale, service, businesses.length);
  const faq: FaqItem[] = [];
  if (price && price.price_avg != null) {
    faq.push({
      q: t("autoFaqPriceQ", { service: serviceName.toLowerCase(), locative }),
      a: t("autoFaqPriceA", {
        avg: formatEur(Number(price.price_avg), locale),
        min: formatEur(Number(price.price_min), locale),
        max: formatEur(Number(price.price_max), locale),
        unit: tu(price.unit!),
        count: price.businesses_count ?? 0,
      }),
    });
  }
  if (businesses.length > 0) {
    faq.push({
      q: t("autoFaqCountQ", {
        plural:
          locale === "sr-Latn-ME"
            ? (service.plural_gen_me ??
              tc("profiles", { count: 5 }).replace(/^\d+\s/, ""))
            : serviceName.toLowerCase(),
        locative,
      }),
      a: t("autoFaqCountA", {
        count,
        locative,
        verified: businesses.filter((b) => b.verified).length,
      }).trim(),
    });
  }
  const content = await getServiceContent(service.id, locale);
  faq.push(...content.faq);
  faq.push({
    q: t("autoFaqContactQ", { service: serviceName.toLowerCase(), locative }),
    a: t("autoFaqContactA"),
  });
  // Short data summary under the heading: unique to this service and town
  // (counts, ratings, prices), which is what search and AI answers quote.
  const inTown = cityPhrase(city, locale).trim();
  const emergencyCount = businesses.filter((b) => b.emergency).length;
  const groupSlug = groups.find((g) => g.id === service.group_id)?.slug;
  const summary = businesses.length
    ? [
        t("summaryCount", { n: businesses.length, count, locative: inTown }),
        reviewCount
          ? t("summaryRating", {
              rating: new Intl.NumberFormat(locale, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(ratingAvg),
              reviews: reviewCount,
            })
          : null,
        price && price.price_avg != null
          ? t("summaryPrice", {
              min: formatEur(Number(price.price_min), locale),
              avg: formatEur(Number(price.price_avg), locale),
              unit: tu(price.unit!),
            })
          : null,
        emergencyCount
          ? t("summaryEmergency", { count: emergencyCount })
          : null,
        region.slug === "primorje" &&
        [
          "kucne-usluge",
          "popravke-i-servis",
          "zanati",
          "apartmani-i-turizam",
        ].includes(groupSlug ?? "")
          ? t("seasonCoast")
          : null,
      ]
        .filter(Boolean)
        .join(" ")
    : null;
  const { tips, description } = content;

  // Internal links (like Košnica): same service in other towns, similar
  // services here. Only combinations with businesses (the rest are noindex).
  const otherCities = cities
    .filter(
      (c) =>
        c.id !== city.id && !c.parent_city_id && indexable.combo(service.id, c),
    )
    .sort(
      (a, b) =>
        indexable.comboCount(service.id, b.id) -
          indexable.comboCount(service.id, a.id) ||
        (b.population ?? 0) - (a.population ?? 0),
    )
    .slice(0, 10);
  const similar = services
    .filter(
      (s) =>
        s.group_id === service.group_id &&
        s.id !== service.id &&
        indexable.combo(s.id, city),
    )
    .sort(
      (a, b) =>
        indexable.comboCount(b.id, city.id) -
          indexable.comboCount(a.id, city.id) || a.sort_order - b.sort_order,
    )
    .slice(0, 10);

  const pageHrefs = Array.from({ length: pageCount }, (_, i) =>
    path(pageHref(service, city, i + 1)(locale)),
  );
  const crumbs = [
    { name: tc("siteName"), href: path("/") },
    {
      name: cityName,
      href: path({ pathname: "/gradovi/[city]", params: { city: city.slug } }),
    },
    { name: serviceName, href: path(comboHref(service, city)(locale)) },
  ];
  const listed = businesses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <BannerLayout
      locale={locale}
      className="space-y-12 py-6 sm:py-8"
      banner={{
        // The service's banner, else the town's (or its municipality's).
        candidates: [
          { scope: "service", id: service.id },
          { scope: "city", id: city.id },
          ...(city.parent_city_id
            ? [{ scope: "city" as const, id: city.parent_city_id }]
            : []),
        ],
        offer: { scope: "service", name: serviceName.toLowerCase() },
      }}
    >
      <SetAlternates paths={localePaths(pageHref(service, city, page))} />
      <JsonLd
        graph={[
          {
            "@type": "Service",
            name: `${serviceName} ${cityName}`,
            serviceType: serviceName,
            areaServed: {
              "@type": "City",
              name: cityName,
              containedInPlace: { "@type": "Country", name: "Montenegro" },
            },
            ...(price?.price_min != null
              ? {
                  offers: {
                    "@type": "AggregateOffer",
                    priceCurrency: "EUR",
                    lowPrice: Number(price.price_min),
                    highPrice: Number(price.price_max),
                    offerCount: price.items_count,
                  },
                }
              : {}),
          },
          ...(listed.length
            ? [
                businessItemList(
                  listed.map((b) => ({
                    name: b.name,
                    href: path({
                      pathname: "/b/[slug]",
                      params: { slug: b.slug },
                    }),
                    schemaType: service.schema_type ?? "LocalBusiness",
                    rating: b.rating,
                    ratingCount: b.ratingCount,
                  })),
                ),
              ]
            : []),
          faqPage(faq),
          breadcrumbList(crumbs),
        ]}
      />

      <header className="space-y-3">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("heading", { service: serviceName, city: cityName })}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
          <span>{t("countLine", { count, locative })}</span>
          {reviewCount > 0 && (
            <Rating
              value={ratingAvg}
              count={reviewCount}
              className="text-foreground"
            />
          )}
          {page > 1 && <span>· {tc("page", { page })}</span>}
        </div>
        {summary && page === 1 && (
          <p className="max-w-3xl leading-relaxed text-pretty">{summary}</p>
        )}
        <InquiryButton serviceId={service.id} cityId={city.id} />
      </header>

      {sponsored.length > 0 && page === 1 && (
        <Section
          title={tc("sponsored")}
          action={
            <span
              className="inline-flex items-center gap-1 text-xs text-muted-foreground"
              title={tc("sponsoredInfo")}
            >
              <Info className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">{tc("sponsoredInfo")}</span>
            </span>
          }
        >
          <BusinessGrid
            businesses={sponsored}
            cityNames={cityNames}
            serviceNames={serviceNames}
            sponsored
          />
        </Section>
      )}

      {businesses.length > 0 ? (
        <Section
          title={
            sponsored.length && page === 1
              ? tc("moreResults")
              : t("heading", { service: serviceName, city: cityName })
          }
        >
          <ResultsList
            businesses={businesses}
            cityNames={cityNames}
            serviceNames={serviceNames}
            page={page}
            pageSize={PAGE_SIZE}
            pageHrefs={pageHrefs}
          />
        </Section>
      ) : (
        <div className="rounded-2xl border border-dashed bg-muted/60 p-8 text-center">
          <h2 className="text-lg font-bold">{t("emptyTitle", { locative })}</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {t("emptyText")}
          </p>
          <Link
            href="/za-biznise"
            className="mt-4 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            {tc("addBusiness")}
          </Link>
        </div>
      )}

      {nearby.length > 0 && (
        <Section
          title={t("nearbyTitle", { region: tr(region, "name", locale) })}
        >
          <BusinessGrid
            businesses={nearby}
            cityNames={cityNames}
            serviceNames={serviceNames}
          />
        </Section>
      )}
      {online.length > 0 && (
        <Section title={t("onlineTitle")}>
          <BusinessGrid
            businesses={online}
            cityNames={cityNames}
            serviceNames={serviceNames}
          />
        </Section>
      )}

      {reviews.length > 0 && (
        <Section
          title={t("reviewsTitle", { service: serviceName, city: cityName })}
        >
          <ReviewList reviews={reviews} showBusiness cityNames={cityNames} />
        </Section>
      )}

      <div className="grid grid-cols-1 gap-12">
        <div className="space-y-12">
          {description && (
            <Section
              title={t("aboutTitle", { service: serviceName.toLowerCase() })}
            >
              <p className="max-w-prose leading-relaxed text-muted-foreground">
                {description}
              </p>
            </Section>
          )}
          <Section title={t("faqTitle")}>
            <Faq items={faq} />
          </Section>
          {tips.length > 0 && (
            <Section
              title={t("tipsTitle", { service: serviceName.toLowerCase() })}
            >
              <ol className="list-decimal space-y-2 pl-5 leading-relaxed text-muted-foreground">
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ol>
            </Section>
          )}
        </div>

        <aside className="space-y-8">
          <Section
            title={t("otherCities", { service: serviceName })}
            className="[&_h2]:text-lg"
          >
            <ul className="space-y-2 text-[15px]">
              {otherCities.map((c) => (
                <li key={c.id}>
                  <a
                    className="text-primary hover:underline"
                    href={path(comboHref(service, c)(locale))}
                  >
                    {serviceName} {tr(c, "name", locale)}
                  </a>
                </li>
              ))}
              <li>
                <a
                  className="font-semibold text-primary hover:underline"
                  href={path({
                    pathname: "/usluge/[service]",
                    params: { service: serviceSlug(service, locale) },
                  })}
                >
                  {t("countryLink", { service: serviceName })}
                </a>
              </li>
            </ul>
          </Section>
          {price && (
            <a
              href={path({
                pathname: "/cijene/[slug]",
                params: {
                  slug: pickPriceStat(priceStats, city.id)
                    ? `${serviceSlug(service, locale)}-${city.slug}`
                    : serviceSlug(service, locale),
                },
              })}
              className="block rounded-2xl bg-secondary/60 p-4 font-semibold hover:bg-secondary"
            >
              {t("pricesLink", {
                service: serviceName.toLowerCase(),
                locative,
              })}{" "}
              →
            </a>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <Section title={t("similarServices", { locative })}>
          <LinkGrid
            links={similar.map((s) => ({
              href: path(comboHref(s, city)(locale)),
              label: `${tr(s, "name", locale)} ${cityName}`,
            }))}
          />
        </Section>
      )}
    </BannerLayout>
  );
}

/** Prebuild combinations that have businesses; the rest render on first request (ISR). */
export async function listingStaticParams(locale: Locale) {
  const [{ services, cities }, coverage] = await Promise.all([
    getTaxonomy(),
    getCoverage(),
  ]);
  return Object.entries(coverage.perServiceCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 300)
    .flatMap(([key]) => {
      const [serviceId, cityId] = key.split(":").map(Number);
      const service = services.find((s) => s.id === serviceId);
      const city = cities.find((c) => c.id === cityId);
      return service && city
        ? [{ slug: `${serviceSlug(service, locale)}-${city.slug}` }]
        : [];
    });
}
