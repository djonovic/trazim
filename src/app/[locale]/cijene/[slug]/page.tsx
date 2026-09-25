import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BusinessGrid } from "@/components/business/business-grid";
import { Rating } from "@/components/business/rating";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { LinkGrid, Section } from "@/components/common/section";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatEur } from "@/lib/format";
import { tr } from "@/lib/i18n-fields";
import { listBusinesses } from "@/lib/queries/businesses";
import {
  getAllPriceStats,
  getPriceTable,
  pickPriceStat,
} from "@/lib/queries/prices";
import {
  cityPhrase,
  getServiceBySlug,
  getTaxonomy,
  nameMaps,
  relatedCityIds,
  resolveServiceCity,
  serviceSlug,
  type City,
  type Service,
} from "@/lib/queries/taxonomy";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { absoluteUrl, localePaths, pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 21600;

export function generateStaticParams() {
  return [];
}

/** "/cijene/elektricar" (country) or "/cijene/elektricar-podgorica" (city). */
async function load(locale: Locale, slug: string) {
  const service = await getServiceBySlug(locale, slug);
  const match = service
    ? { service, city: null }
    : await resolveServiceCity(locale, slug);
  if (!match) notFound();

  const cityIds = match.city ? await relatedCityIds(match.city) : null;
  const [stats, table] = await Promise.all([
    getAllPriceStats(),
    getPriceTable(match.service.id, cityIds),
  ]);
  const serviceStats = stats.filter((s) => s.service_id === match.service.id);
  const stat = pickPriceStat(serviceStats, match.city?.id ?? 0);
  return { ...match, cityIds, table, stat, serviceStats };
}

const priceSlug = (service: Service, city: City | null) => (locale: Locale) =>
  city
    ? `${serviceSlug(service, locale)}-${city.slug}`
    : serviceSlug(service, locale);
const priceHref =
  (service: Service, city: City | null) => (locale: Locale) => ({
    pathname: "/cijene/[slug]" as const,
    params: { slug: priceSlug(service, city)(locale) },
  });

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cijene/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const { service, city, stat } = await load(locale, slug);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const tu = await getTranslations({ locale, namespace: "Units" });
  const name = tr(service, "name", locale);
  return pageMetadata({
    locale,
    paths: localePaths(priceHref(service, city)),
    title: t("priceTitle", {
      service: name.toLowerCase(),
      city: cityPhrase(city, locale),
      year: new Date().getFullYear(),
    }),
    description: stat
      ? t("priceDescription", {
          avg: formatEur(Number(stat.price_avg), locale),
          unit: tu(stat.unit!),
          min: formatEur(Number(stat.price_min), locale),
          max: formatEur(Number(stat.price_max), locale),
          count: stat.businesses_count ?? 0,
          city: cityPhrase(city, locale),
        })
      : t("pricesDescription"),
    // No prices yet: nothing useful to index.
    noindex: !stat,
  });
}

export default async function PricePage({
  params,
}: PageProps<"/[locale]/cijene/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const { service, city, cityIds, table, stat, serviceStats } = await load(
    locale,
    slug,
  );
  const t = await getTranslations({ locale, namespace: "Prices" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const tu = await getTranslations({ locale, namespace: "Units" });
  const { cities, services } = await getTaxonomy();
  const { cityNames, serviceNames } = await nameMaps(locale);
  const businesses = (
    await listBusinesses({
      serviceId: service.id,
      cityIds: cityIds ?? undefined,
    })
  ).slice(0, 6);
  const path = (href: Parameters<typeof getPathname>[0]["href"]) =>
    getPathname({ locale, href });

  const name = tr(service, "name", locale);
  const where = cityPhrase(city, locale);
  const rated = businesses.filter((b) => b.ratingCount);
  const reviews = rated.reduce((n, b) => n + b.ratingCount, 0);
  const avgRating = reviews
    ? rated.reduce((n, b) => n + b.rating * b.ratingCount, 0) / reviews
    : 0;

  // Cities that have their own price data for this service.
  const cityGuides = serviceStats
    .filter((s) => s.city_key !== 0 && s.city_key !== city?.id)
    .flatMap((s) => cities.filter((c) => c.id === s.city_key))
    .filter((c, i, all) => all.findIndex((x) => x.id === c.id) === i);
  const allStats = await getAllPriceStats();
  const otherGuides = services
    .filter(
      (s) =>
        s.id !== service.id &&
        allStats.some((x) => x.service_id === s.id && x.city_key === 0),
    )
    .sort(
      (a, b) =>
        Number(b.group_id === service.group_id) -
        Number(a.group_id === service.group_id),
    )
    .slice(0, 12);

  // Direct answer + sources for search and AI engines ("Koliko košta…?").
  const title = t("heading1", { service: name.toLowerCase(), city: where });
  const updated = stat?.computed_at
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone: "Europe/Podgorica",
      }).format(new Date(stat.computed_at))
    : null;
  const eur = (v: number | string | null) => formatEur(Number(v), locale);
  const answer =
    stat && stat.price_avg != null
      ? t("answer", {
          service: name.toLowerCase(),
          city: where,
          avg: eur(stat.price_avg),
          unit: tu(stat.unit!),
          p25: eur(stat.price_p25),
          p75: eur(stat.price_p75),
          min: eur(stat.price_min),
          max: eur(stat.price_max),
        })
      : null;
  const basis =
    stat && updated
      ? t("basis", {
          items: stat.items_count ?? 0,
          businesses: stat.businesses_count ?? 0,
          date: updated,
        })
      : null;
  // Country page: the same unit's numbers per city.
  const cityRows = city
    ? []
    : serviceStats
        .filter((s) => s.city_key !== 0 && s.unit === stat?.unit)
        .flatMap((s) => {
          const c = cities.find((x) => x.id === s.city_key);
          return c ? [{ city: c, stat: s }] : [];
        })
        .sort(
          (a, b) =>
            (b.stat.businesses_count ?? 0) - (a.stat.businesses_count ?? 0),
        );
  const pageUrl = absoluteUrl(path(priceHref(service, city)(locale)));
  const csvUrl = absoluteUrl(`/data/cijene/${service.slug_me}.csv`);

  const crumbs = [
    { name: tc("siteName"), href: path("/") },
    { name: t("heading"), href: path("/cijene") },
    ...(city ? [{ name, href: path(priceHref(service, null)(locale)) }] : []),
    {
      name: city ? tr(city, "name", locale) : name,
      href: path(priceHref(service, city)(locale)),
    },
  ];
  const listingHref = city
    ? path({
        pathname: "/[slug]",
        params: { slug: `${serviceSlug(service, locale)}-${city.slug}` },
      })
    : path({
        pathname: "/usluge/[service]",
        params: { service: serviceSlug(service, locale) },
      });

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-8">
      <SetAlternates paths={localePaths(priceHref(service, city))} />
      <JsonLd
        graph={[
          {
            "@type": "WebPage",
            name: title,
            ...(stat?.computed_at ? { dateModified: stat.computed_at } : {}),
          },
          ...(stat && answer && basis
            ? [
                {
                  "@type": "Dataset",
                  name: title,
                  description: `${answer} ${basis}`,
                  url: pageUrl,
                  dateModified: stat.computed_at,
                  temporalCoverage: String(new Date().getFullYear()),
                  spatialCoverage: {
                    "@type": "Place",
                    name: city ? `${city.name_me}, Crna Gora` : "Crna Gora",
                  },
                  creator: { "@id": absoluteUrl("/#organization") },
                  license: "https://creativecommons.org/licenses/by/4.0/",
                  isAccessibleForFree: true,
                  variableMeasured: [
                    "average price",
                    "median price",
                    "interquartile range",
                    "min and max price",
                  ],
                  distribution: {
                    "@type": "DataDownload",
                    encodingFormat: "text/csv",
                    contentUrl: csvUrl,
                  },
                },
              ]
            : []),
          ...(stat
            ? [
                {
                  "@type": "Service",
                  name,
                  serviceType: name,
                  areaServed: city
                    ? { "@type": "City", name: city.name_me }
                    : { "@type": "Country", name: "Montenegro" },
                  offers: {
                    "@type": "AggregateOffer",
                    priceCurrency: "EUR",
                    lowPrice: Number(stat.price_min),
                    highPrice: Number(stat.price_max),
                    offerCount: stat.items_count,
                  },
                },
              ]
            : []),
          breadcrumbList(crumbs),
        ]}
      />

      <header className="space-y-3">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        {answer ? (
          <div className="max-w-3xl space-y-1">
            <p className="text-lg leading-relaxed">{answer}</p>
            {basis && <p className="text-sm text-muted-foreground">{basis}</p>}
          </div>
        ) : (
          <p className="text-muted-foreground">{t("sub")}</p>
        )}
      </header>

      {stat ? (
        <section className="grid gap-6 rounded-2xl bg-secondary/60 p-6 sm:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("average")}</p>
            <p className="text-3xl font-extrabold text-primary">
              {formatEur(Number(stat.price_avg), locale)}
            </p>
            <p className="text-sm text-muted-foreground">{tu(stat.unit!)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("range")}</p>
            <p className="text-2xl font-bold">
              {formatEur(Number(stat.price_min), locale)} –{" "}
              {formatEur(Number(stat.price_max), locale)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">&nbsp;</p>
            <p className="text-2xl font-bold">
              {t("businesses", { count: stat.businesses_count ?? 0 })}
            </p>
          </div>
          {reviews > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">&nbsp;</p>
              <Rating value={avgRating} count={reviews} size="lg" />
            </div>
          )}
        </section>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          {t("noData", { city: where })}
        </p>
      )}

      {table.length > 0 && (
        <Section title={t("tableItem")} className="[&_h2]:sr-only">
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-muted/60 text-sm text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("tableItem")}</th>
                  <th className="px-4 py-3 font-semibold">{t("tableUnit")}</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {t("tableAvg")}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {t("tableRange")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {table.slice(0, 25).map((row) => (
                  <tr key={`${row.name}-${row.unit}`}>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {tu(row.unit)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      {formatEur(row.avg, locale)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-muted-foreground">
                      {row.min === row.max
                        ? formatEur(row.min, locale)
                        : `${formatEur(row.min, locale)} – ${formatEur(row.max, locale)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("mostCommon", {
              item: table[0].name,
              price: formatEur(table[0].avg, locale),
            })}
          </p>
        </Section>
      )}

      {cityRows.length > 0 && stat && (
        <Section title={t("byCity")}>
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-muted/60 text-sm text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("colCity")}</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {t("tableAvg")}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {t("colMedian")}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {t("colTypical")}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {t("colBusinesses")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cityRows.map(({ city: c, stat: s }) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <a
                        href={path(priceHref(service, c)(locale))}
                        className="font-medium text-primary hover:underline"
                      >
                        {tr(c, "name", locale)}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      {eur(s.price_avg)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {eur(s.price_median)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-muted-foreground">
                      {eur(s.price_p25)} – {eur(s.price_p75)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {s.businesses_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">{tu(stat.unit!)}</p>
        </Section>
      )}

      {businesses.length > 0 && (
        <Section
          title={t("seeBusinesses", { service: name, city: where })}
          action={
            <a
              href={listingHref}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {tc("seeAll")}
            </a>
          }
        >
          <BusinessGrid
            businesses={businesses}
            cityNames={cityNames}
            serviceNames={serviceNames}
          />
        </Section>
      )}

      {(cityGuides.length > 0 || city) && (
        <Section title={t("otherCities")}>
          <LinkGrid
            links={[
              ...(city
                ? [
                    {
                      href: path(priceHref(service, null)(locale)),
                      label: `${name}: ${tc("allOfMontenegro")}`,
                    },
                  ]
                : []),
              ...cityGuides.map((c) => ({
                href: path(priceHref(service, c)(locale)),
                label: `${name} ${tr(c, "name", locale)}`,
              })),
            ]}
          />
        </Section>
      )}

      {stat && (
        <Section title={t("methodTitle")} className="[&_h2]:text-lg">
          <div className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-muted-foreground">
            <p>{t("methodText")}</p>
            <p>
              <a
                href={csvUrl}
                className="font-semibold text-primary hover:underline"
              >
                {t("download")}
              </a>
            </p>
            {updated && (
              <p className="text-sm">
                {t("cite", { title, url: pageUrl, date: updated })}
              </p>
            )}
          </div>
        </Section>
      )}

      {otherGuides.length > 0 && (
        <Section title={t("otherGuides")}>
          <LinkGrid
            links={otherGuides.map((s) => ({
              href: path(priceHref(s, null)(locale)),
              label: tr(s, "name", locale),
            }))}
          />
        </Section>
      )}
    </main>
  );
}
