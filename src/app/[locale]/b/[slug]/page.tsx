import {
  BadgeCheck,
  Clock,
  Eye,
  Languages,
  MapPin,
  ShieldAlert,
  Wifi,
  Zap,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BusinessGrid } from "@/components/business/business-grid";
import { BusinessMap } from "@/components/business/business-map";
import { Gallery } from "@/components/business/gallery";
import { ContactButtons } from "@/components/business/contact-buttons";
import { OpenNowBadge } from "@/components/business/open-now-badge";
import { Rating } from "@/components/business/rating";
import { ReviewList } from "@/components/business/review-list";
import { ReportButton } from "@/components/reviews/report-button";
import { ReviewComposer } from "@/components/reviews/review-composer";
import { ReviewPhotos } from "@/components/reviews/review-photos";
import { ShareButton } from "@/components/business/share-button";
import { ViewTracker } from "@/components/business/view-tracker";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { LinkGrid, Section } from "@/components/common/section";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  formatEur,
  formatTime,
  languageName,
  monthYearSince,
  viewsBucket,
} from "@/lib/format";
import { tr } from "@/lib/i18n-fields";
import {
  getBusinessProfile,
  listBusinesses,
  listRecentReviews,
} from "@/lib/queries/businesses";
import {
  cityLocative,
  getTaxonomy,
  nameMaps,
  serviceSlug,
} from "@/lib/queries/taxonomy";
import { getIndexability } from "@/lib/seo/indexable";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { absoluteUrl, localePaths, pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

// Rendered on first request, then cached (ISR).
export function generateStaticParams() {
  return [];
}

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;
const schemaDays = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

async function load(slug: string) {
  const business = await getBusinessProfile(slug);
  if (!business) notFound();
  const { services, cities } = await getTaxonomy();
  const city = cities.find((c) => c.id === business.city_id)!;
  const primaryIds = business.business_services
    .filter((s) => s.is_primary)
    .map((s) => s.service_id);
  const serviceIds = primaryIds.length
    ? primaryIds
    : business.business_services.map((s) => s.service_id);
  const businessServices = serviceIds.flatMap((id) =>
    services.filter((s) => s.id === id),
  );
  const allServices = [...business.business_services]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    .flatMap((bs) => services.filter((s) => s.id === bs.service_id));
  return {
    business,
    city,
    primaryService: businessServices[0] ?? null,
    allServices,
    cities,
  };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/b/[slug]">) {
  const { locale, slug } = await params;
  const { business, city } = await load(slug);
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Metadata",
  });
  const rating = business.rating_count
    ? t("listingRating", {
        rating: Number(business.rating_avg).toFixed(1),
        count: business.rating_count,
      })
    : "";
  const meta = pageMetadata({
    image: false,
    locale: locale as Locale,
    paths: localePaths({ pathname: "/b/[slug]", params: { slug } }),
    title: `${business.name}, ${tr(city, "name", locale as Locale)}`,
    description: t("profileDescription", {
      rating,
      description: (business.description ?? "")
        .replace(/\s+/g, " ")
        .slice(0, 150),
    }),
    // New, unmoderated profiles stay out of the index until reviewed.
    noindex: business.moderated_at == null,
  });
  return meta;
}

export default async function BusinessPage({
  params,
}: PageProps<"/[locale]/b/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const { business, city, primaryService, allServices, cities } =
    await load(slug);
  const t = await getTranslations({ locale, namespace: "Profile" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const tu = await getTranslations({ locale, namespace: "Units" });
  const tw = await getTranslations({ locale, namespace: "Weekdays" });
  const { cityNames, serviceNames } = await nameMaps(locale);
  const path = (href: Parameters<typeof getPathname>[0]["href"]) =>
    getPathname({ locale, href });

  const [reviews, related] = await Promise.all([
    listRecentReviews({ businessIds: [business.id], limit: 20 }),
    primaryService
      ? listBusinesses({ serviceId: primaryService.id, cityIds: [city.id] })
      : Promise.resolve([]),
  ]);
  const alsoViewed = related.filter((b) => b.id !== business.id).slice(0, 6);
  // Related links only to combinations that have businesses (others are noindex).
  const indexable = await getIndexability();
  const { services } = await getTaxonomy();
  const relatedServices = primaryService
    ? services
        .filter(
          (s) =>
            s.group_id === primaryService.group_id &&
            indexable.combo(s.id, city),
        )
        .slice(0, 8)
    : [];
  const relatedCities = primaryService
    ? cities
        .filter(
          (c) =>
            !c.parent_city_id &&
            c.id !== city.id &&
            indexable.combo(primaryService.id, c),
        )
        .sort(
          (a, b) =>
            indexable.comboCount(primaryService.id, b.id) -
            indexable.comboCount(primaryService.id, a.id),
        )
        .slice(0, 8)
    : [];
  const views = viewsBucket(business.views_count);
  const areaCities = business.business_cities
    .map((bc) => cities.find((c) => c.id === bc.city_id))
    .filter((c) => c != null);

  const serviceCityHref = (
    service: NonNullable<typeof primaryService>,
    citySlug: string,
  ) =>
    path({
      pathname: "/[slug]",
      params: { slug: `${serviceSlug(service, locale)}-${citySlug}` },
    });

  const crumbs = [
    { name: tc("siteName"), href: path("/") },
    {
      name: tr(city, "name", locale),
      href: path({ pathname: "/gradovi/[city]", params: { city: city.slug } }),
    },
    ...(primaryService
      ? [
          {
            name: tr(primaryService, "name", locale),
            href: serviceCityHref(primaryService, city.slug),
          },
        ]
      : []),
    {
      name: business.name,
      href: path({ pathname: "/b/[slug]", params: { slug } }),
    },
  ];

  const hoursByDay = WEEKDAYS.map((d) => ({
    day: d,
    slots: business.business_hours.filter((h) => h.weekday === d),
  }));
  const hasHours = business.business_hours.length > 0;

  const priceLabel = (item: (typeof business.priceList)[number]) => {
    const unit = tu(item.unit);
    switch (item.kind) {
      case "on_request":
        return t("priceOnRequest");
      case "free":
        return t("priceFree");
      case "from":
        return `${tc("priceFrom", { price: formatEur(Number(item.price_from), locale) })} ${unit}`;
      case "range":
        return `${formatEur(Number(item.price_from), locale)} – ${formatEur(Number(item.price_to), locale)} ${unit}`;
      default:
        return `${formatEur(Number(item.price_from), locale)} ${unit}`;
    }
  };

  const profileUrl = absoluteUrl(
    path({ pathname: "/b/[slug]", params: { slug } }),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:py-8 lg:pb-8">
      <SetAlternates
        paths={localePaths({ pathname: "/b/[slug]", params: { slug } })}
      />
      <ViewTracker businessId={business.id} />
      <JsonLd
        graph={[
          {
            "@type": primaryService?.schema_type ?? "LocalBusiness",
            "@id": `${profileUrl}#business`,
            name: business.name,
            url: profileUrl,
            description: business.description ?? undefined,
            image: business.photos.map((p) => p.url),
            address: {
              "@type": "PostalAddress",
              streetAddress: business.address ?? undefined,
              addressLocality: city.name_me,
              addressCountry: "ME",
            },
            ...(business.lat && business.lng
              ? {
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: business.lat,
                    longitude: business.lng,
                  },
                }
              : {}),
            areaServed: areaCities.map((c) => ({
              "@type": "City",
              name: c.name_me,
            })),
            ...(business.rating_count
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: Number(business.rating_avg),
                    ratingCount: business.rating_count,
                    reviewCount: business.rating_count,
                    bestRating: 5,
                  },
                  review: reviews.slice(0, 5).map((r) => ({
                    "@type": "Review",
                    author: { "@type": "Person", name: r.author },
                    datePublished: r.createdAt.slice(0, 10),
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: r.rating,
                      bestRating: 5,
                    },
                    reviewBody: r.body ?? undefined,
                  })),
                }
              : {}),
            ...(hasHours
              ? {
                  openingHoursSpecification: business.business_hours.map(
                    (h) => ({
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: schemaDays[h.weekday],
                      opens: formatTime(h.opens_at),
                      closes: formatTime(h.closes_at),
                    }),
                  ),
                }
              : {}),
            sameAs: [business.website, business.instagram].filter(Boolean),
          },
          breadcrumbList(crumbs),
        ]}
      />

      <Breadcrumbs items={crumbs} />

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-10">
          <header className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {business.name}
                {business.verified_at && (
                  <span
                    className="ml-2 inline-flex translate-y-[-4px] items-center gap-1 rounded-full bg-secondary px-2.5 py-1 align-middle text-sm font-semibold text-primary"
                    title={tc("verifiedHint")}
                  >
                    <BadgeCheck className="size-4" aria-hidden />
                    {tc("verified")}
                  </span>
                )}
              </h1>
              <ShareButton title={business.name} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" aria-hidden />
                {tr(city, "name", locale)}
              </span>
              <Rating
                value={Number(business.rating_avg)}
                count={business.rating_count}
                className="text-foreground"
              />
              {views && (
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-4" aria-hidden />
                  {tc("views", { count: views })}
                </span>
              )}
              {business.response_time_bucket && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-4" aria-hidden />
                  {tc(`responseTime.${business.response_time_bucket}`)}
                </span>
              )}
              <OpenNowBadge
                hours={business.business_hours.map((h) => ({
                  weekday: h.weekday,
                  opensAt: h.opens_at,
                  closesAt: h.closes_at,
                }))}
                emergency={business.emergency_24h}
              />
              {business.emergency_24h && (
                <span className="inline-flex items-center gap-1 font-medium text-destructive">
                  <Zap className="size-4" aria-hidden />
                  {tc("emergency")}
                </span>
              )}
              {business.offers_online && (
                <span className="inline-flex items-center gap-1">
                  <Wifi className="size-4" aria-hidden />
                  {tc("online")}
                </span>
              )}
            </div>
            {business.moderated_at == null && (
              <p className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                <ShieldAlert className="size-4" aria-hidden />
                {tc("underReview")}: {t("underReviewNote")}
              </p>
            )}
          </header>

          {business.photos.length > 0 && (
            <Gallery
              photos={business.photos.map((p) => ({ id: p.id, url: p.url }))}
              name={business.name}
            />
          )}

          <Section title={t("services")} className="[&_h2]:text-lg">
            <ul className="flex flex-wrap gap-2">
              {allServices.map((s) => (
                <li key={s.id}>
                  <a
                    href={serviceCityHref(s, city.slug)}
                    className="inline-flex h-9 items-center rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-accent"
                  >
                    {tr(s, "name", locale)}
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          {business.description && (
            <Section title={t("about")} className="[&_h2]:text-lg">
              <p className="max-w-prose leading-relaxed whitespace-pre-line">
                {business.description}
              </p>
            </Section>
          )}

          {business.priceList.length > 0 && (
            <Section title={t("priceList")} className="[&_h2]:text-lg">
              <ul className="divide-y rounded-2xl border bg-white">
                {business.priceList.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-baseline justify-between gap-4 px-4 py-3"
                  >
                    <span>{item.name}</span>
                    <span className="shrink-0 text-right font-semibold whitespace-nowrap">
                      {priceLabel(item)}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="grid gap-10 sm:grid-cols-2">
            {hasHours && (
              <Section title={t("hours")} className="[&_h2]:text-lg">
                <dl className="space-y-1.5 text-[15px]">
                  {hoursByDay.map(({ day, slots }) => (
                    <div key={day} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">
                        {tw(String(day) as "1")}
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {business.emergency_24h
                          ? t("open24")
                          : slots.length
                            ? slots
                                .map(
                                  (s) =>
                                    `${formatTime(s.opens_at)}–${formatTime(s.closes_at)}`,
                                )
                                .join(", ")
                            : t("closed")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}
            <Section title={t("serviceArea")} className="[&_h2]:text-lg">
              <p className="text-[15px]">
                {areaCities.map((c) => tr(c, "name", locale)).join(", ")}
              </p>
              {(business.lat ?? city.lat) != null && (
                <BusinessMap
                  lat={(business.lat ?? city.lat)!}
                  lng={(business.lng ?? city.lng)!}
                  // Exact spot when the owner set one, otherwise the town.
                  radiusMeters={business.lat != null ? 300 : 2500}
                  label={
                    business.lat != null
                      ? business.name
                      : tr(city, "name", locale)
                  }
                />
              )}
              {business.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    business.lat && business.lng
                      ? `${business.lat},${business.lng}`
                      : `${business.address}, ${city.name_me}`,
                  )}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <MapPin className="size-4" aria-hidden />
                  {business.address}
                </a>
              )}
              {business.languages.length > 0 && (
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Languages className="size-4" aria-hidden />
                  {business.languages
                    .map((l) => languageName(l, locale))
                    .join(", ")}
                </p>
              )}
            </Section>
          </div>

          <Section title={t("reviewsTitle")} id="recenzije">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {business.rating_count > 0 && (
                <Rating
                  value={Number(business.rating_avg)}
                  count={business.rating_count}
                  size="lg"
                />
              )}
              <ReviewComposer
                businessId={business.id}
                businessName={business.name}
                ownerId={business.owner_id}
              />
            </div>
            {reviews.some((r) => r.photos.length > 0) && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {t("customerPhotos")}
                </h3>
                <ReviewPhotos
                  photos={reviews.flatMap((r) => r.photos).slice(0, 12)}
                  alt={t("customerPhotos")}
                />
              </div>
            )}
            {reviews.length ? (
              <ReviewList reviews={reviews} reportable />
            ) : (
              <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                {t("noReviews")}
              </p>
            )}
          </Section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {t("memberSince", {
                date: monthYearSince(new Date(business.created_at), locale),
              })}
            </p>
            <ReportButton
              target="business"
              businessId={business.id}
              label={t("report")}
            />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
            <p className="font-bold">{t("contact")}</p>
            <ContactButtons
              businessId={business.id}
              channels={business.channels}
              website={business.website}
              instagram={business.instagram}
            />
          </div>
        </aside>
      </div>

      {alsoViewed.length > 0 && (
        <Section title={t("alsoViewed")} className="mt-14">
          <BusinessGrid
            businesses={alsoViewed}
            cityNames={cityNames}
            serviceNames={serviceNames}
          />
        </Section>
      )}

      {primaryService &&
        (relatedServices.length > 0 || relatedCities.length > 0) && (
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {relatedServices.length > 0 && (
              <Section
                title={t("servicesIn", {
                  locative: cityLocative(city, locale),
                })}
                className="[&_h2]:text-lg"
              >
                <LinkGrid
                  links={relatedServices.map((s) => ({
                    href: serviceCityHref(s, city.slug),
                    label: `${tr(s, "name", locale)} ${tr(city, "name", locale)}`,
                  }))}
                />
              </Section>
            )}
            {relatedCities.length > 0 && (
              <Section
                title={t("otherCities", {
                  service: tr(primaryService, "name", locale),
                })}
                className="[&_h2]:text-lg"
              >
                <LinkGrid
                  links={relatedCities.map((c) => ({
                    href: serviceCityHref(primaryService, c.slug),
                    label: `${tr(primaryService, "name", locale)} ${tr(c, "name", locale)}`,
                  }))}
                />
              </Section>
            )}
          </div>
        )}

      {/* Mobile: sticky contact bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur lg:hidden">
        <ContactButtons
          businessId={business.id}
          channels={business.channels}
          website={business.website}
          instagram={business.instagram}
          layout="bar"
        />
      </div>
    </main>
  );
}
