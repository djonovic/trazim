import { ArrowRight, MessageCircle, Search, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BusinessGrid } from "@/components/business/business-grid";
import { ReviewList } from "@/components/business/review-list";
import { Faq, type FaqItem } from "@/components/common/faq";
import { Section } from "@/components/common/section";
import { SetAlternates } from "@/components/layout/alternates";
import { SearchBar } from "@/components/search/search-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPathname, Link } from "@/i18n/navigation";
import { hreflang, type Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { POPULAR_CITY_SLUGS, POPULAR_SERVICE_SLUGS } from "@/lib/popular";
import {
  getSiteStats,
  listBusinesses,
  listRecentReviews,
  listSponsored,
} from "@/lib/queries/businesses";
import { getIndexability } from "@/lib/seo/indexable";
import { getTaxonomy, nameMaps, serviceSlug } from "@/lib/queries/taxonomy";
import { faqPage, organization, website } from "@/lib/seo/jsonld";
import { localePaths, pageMetadata } from "@/lib/seo/metadata";
import { SPONSOR_SLOTS } from "@/lib/site";
import { BannerLayout } from "@/components/layout/banner-layout";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Metadata",
  });
  return pageMetadata({
    image: false,
    locale: locale as Locale,
    paths: localePaths("/"),
    title: t("title"),
    description: t("description"),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Home" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const { groups, services, cities } = await getTaxonomy();
  const { cityNames, serviceNames } = await nameMaps(locale);
  const [sponsored, popular, reviews, stats, indexable] = await Promise.all([
    listSponsored({ limit: SPONSOR_SLOTS.home }),
    listBusinesses({ limit: 300 }),
    listRecentReviews({ limit: 4 }),
    getSiteStats(),
    getIndexability(),
  ]);
  const path = (href: Parameters<typeof getPathname>[0]["href"]) =>
    getPathname({ locale, href });

  const popularServices = POPULAR_SERVICE_SLUGS.flatMap((slug) =>
    services.filter((s) => s.slug_me === slug),
  );
  const popularCities = POPULAR_CITY_SLUGS.flatMap((slug) =>
    cities.filter((c) => c.slug === slug),
  );
  const municipalities = cities.filter((c) => !c.parent_city_id);
  const faq = t.raw("faq") as FaqItem[];

  const how = [
    { icon: Search, title: t("how1Title"), text: t("how1Text") },
    { icon: Users, title: t("how2Title"), text: t("how2Text") },
    { icon: MessageCircle, title: t("how3Title"), text: t("how3Text") },
  ];

  return (
    <main>
      <SetAlternates paths={localePaths("/")} />
      <JsonLd
        graph={[website(hreflang[locale]), organization(), faqPage(faq)]}
      />

      {/* Hero */}
      <section className="bg-linear-to-b from-secondary/70 to-background">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:pt-20 sm:pb-14">
          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
              {t("heading")}
            </h1>
            <p className="text-lg text-pretty text-muted-foreground">
              {t("subheading", {
                count: Math.floor(services.length / 10) * 10,
              })}
            </p>
          </div>
          <SearchBar locale={locale} className="mt-7" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {groups.slice(0, 7).map((g) => (
              <li key={g.id}>
                <Link
                  href={{ pathname: "/usluge", hash: g.slug }}
                  className="inline-flex h-9 items-center rounded-full border bg-white px-4 text-sm font-medium hover:border-primary/40"
                >
                  {tr(g, "name", locale)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/usluge"
                className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-semibold text-primary"
              >
                {tc("seeAll")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <BannerLayout
        locale={locale}
        as="div"
        // Phones: the banner card comes first, right under the hero, which
        // already ends with its own padding.
        className="space-y-16 py-10 max-lg:pt-0"
        banner={{
          candidates: [{ scope: "home", id: null }],
          offer: { scope: "home" },
        }}
      >
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

        {popular.length > 0 && (
          <Section title={t("popular")}>
            <BusinessGrid
              businesses={popular.slice(0, 6)}
              cityNames={cityNames}
              serviceNames={serviceNames}
            />
          </Section>
        )}

        {/* Stats */}
        <section className="grid gap-8 rounded-3xl bg-primary p-8 text-primary-foreground sm:grid-cols-[1.3fr_1fr] sm:p-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {t("statsTitle")}
            </h2>
            <p className="text-lg text-primary-foreground/80">
              {t("statsSubtitle")}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-center">
            {[
              [municipalities.length, t("statCities")],
              [services.length, t("statServices")],
              [stats.businesses, t("statBusinesses")],
            ].map(([value, label]) => (
              <div key={String(label)}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-3xl font-extrabold tabular-nums sm:text-4xl">
                  {value}
                </dd>
                <dd className="text-sm text-primary-foreground/80">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Section
          title={t("popularServices")}
          action={
            <Link
              href="/usluge"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {tc("seeAll")}
            </Link>
          }
        >
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {popularServices.slice(0, 12).map((s) => (
              <li key={s.id}>
                <Link
                  href={{
                    pathname: "/usluge/[service]",
                    params: { service: serviceSlug(s, locale) },
                  }}
                  className="flex h-14 items-center rounded-xl border bg-white px-4 font-semibold hover:border-primary/40"
                >
                  {tr(s, "name", locale)}
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title={t("citiesTitle")}
          action={
            <Link
              href="/gradovi"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {tc("seeAll")}
            </Link>
          }
        >
          <ul className="flex flex-wrap gap-2">
            {municipalities.slice(0, 12).map((c) => (
              <li key={c.id}>
                <Link
                  href={{
                    pathname: "/gradovi/[city]",
                    params: { city: c.slug },
                  }}
                  className="inline-flex h-10 items-center rounded-full border bg-white px-4 text-sm font-medium hover:border-primary/40"
                >
                  {tr(c, "name", locale)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            {t("citiesMore", { count: cities.length - 12 })}
          </p>
        </Section>

        <Section title={t("howTitle")}>
          <ol className="grid gap-4 sm:grid-cols-3">
            {how.map((step, i) => (
              <li
                key={step.title}
                className="space-y-2 rounded-2xl border bg-card p-6"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <h3 className="pt-2 text-lg font-bold">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {reviews.length > 0 && (
          <Section title={t("latestActivity")}>
            <ReviewList reviews={reviews} showBusiness cityNames={cityNames} />
          </Section>
        )}

        <Section title={t("faqTitle")}>
          <Faq items={faq} />
        </Section>

        <Section title={t("popularSearches")}>
          <Tabs defaultValue={popularCities[0]?.slug}>
            <TabsList className="w-full flex-wrap justify-start gap-2 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
              {popularCities.map((c) => (
                <TabsTrigger
                  key={c.id}
                  value={c.slug}
                  className="h-9 flex-none rounded-full border px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tr(c, "name", locale)}
                </TabsTrigger>
              ))}
            </TabsList>
            {popularCities.map((c) => (
              <TabsContent
                key={c.id}
                value={c.slug}
                forceMount
                className="data-[state=inactive]:hidden"
              >
                <ul className="grid grid-cols-1 gap-x-6 gap-y-2 pt-4 text-[15px] sm:grid-cols-2 xl:grid-cols-4">
                  {popularServices
                    .filter((s) => indexable.combo(s.id, c))
                    .slice(0, 12)
                    .map((s) => (
                      <li key={s.id}>
                        <a
                          className="text-primary hover:underline"
                          href={path({
                            pathname: "/[slug]",
                            params: {
                              slug: `${serviceSlug(s, locale)}-${c.slug}`,
                            },
                          })}
                        >
                          {tr(s, "name", locale)} {tr(c, "name", locale)}
                        </a>
                      </li>
                    ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </Section>

        <section className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-warm/20 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {t("forBusinessTitle")}
            </h2>
            <p className="max-w-lg text-muted-foreground">
              {t("forBusinessText")}
            </p>
          </div>
          <Link
            href="/za-biznise"
            className="inline-flex h-12 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t("forBusinessCta")}
          </Link>
        </section>
      </BannerLayout>
    </main>
  );
}
