import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BusinessGrid } from "@/components/business/business-grid";
import { ResultsList } from "@/components/business/results-list";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Faq } from "@/components/common/faq";
import { LinkGrid, Section } from "@/components/common/section";
import { InquiryButton } from "@/components/inquiries/inquiry-button";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { listBusinesses, listSponsored } from "@/lib/queries/businesses";
import {
  getServiceBySlug,
  getServiceContent,
  getTaxonomy,
  nameMaps,
  serviceSlug,
} from "@/lib/queries/taxonomy";
import { getIndexability } from "@/lib/seo/indexable";
import { breadcrumbList, faqPage } from "@/lib/seo/jsonld";
import { localePaths, pageMetadata } from "@/lib/seo/metadata";
import { SPONSOR_SLOTS } from "@/lib/site";
import { BannerLayout } from "@/components/layout/banner-layout";

export const revalidate = 3600;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const { services } = await getTaxonomy();
  const locale = routing.locales.includes(params.locale as Locale)
    ? (params.locale as Locale)
    : routing.defaultLocale;
  return services.map((s) => ({ service: serviceSlug(s, locale) }));
}

async function load(locale: Locale, slug: string) {
  const service = await getServiceBySlug(locale, slug);
  if (!service) notFound();
  const businesses = await listBusinesses({ serviceId: service.id });
  return { service, businesses };
}

const hrefFor =
  (service: Awaited<ReturnType<typeof load>>["service"]) =>
  (locale: Locale) => ({
    pathname: "/usluge/[service]" as const,
    params: { service: serviceSlug(service, locale) },
  });

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/usluge/[service]">) {
  const { locale: raw, service: slug } = await params;
  const locale = raw as Locale;
  const { service, businesses } = await load(locale, slug);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const name = tr(service, "name", locale);
  return pageMetadata({
    locale,
    paths: localePaths(hrefFor(service)),
    title: t("serviceTitle", { service: name, count: businesses.length }),
    description: t("serviceDescription", { service: name }),
    noindex: businesses.length === 0,
  });
}

export default async function ServicePage({
  params,
}: PageProps<"/[locale]/usluge/[service]">) {
  const { locale: raw, service: slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const { service, businesses } = await load(locale, slug);
  const t = await getTranslations({ locale, namespace: "Services" });
  const tl = await getTranslations({ locale, namespace: "Listing" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const { cities } = await getTaxonomy();
  const [indexable, sponsored] = await Promise.all([
    getIndexability(),
    listSponsored({ serviceId: service.id, limit: SPONSOR_SLOTS.page }),
  ]);
  const { cityNames, serviceNames } = await nameMaps(locale);
  const name = tr(service, "name", locale);
  const path = (href: Parameters<typeof getPathname>[0]["href"]) =>
    getPathname({ locale, href });

  const { faq, description } = await getServiceContent(service.id, locale);
  const crumbs = [
    { name: tc("siteName"), href: path("/") },
    { name: tc("allOfMontenegro"), href: path("/usluge") },
    { name, href: path(hrefFor(service)(locale)) },
  ];
  // Only towns where someone offers it (other combinations are noindex).
  const cityLinks = cities
    .filter((c) => !c.parent_city_id && indexable.combo(service.id, c))
    .sort(
      (a, b) =>
        indexable.comboCount(service.id, b.id) -
          indexable.comboCount(service.id, a.id) ||
        (b.population ?? 0) - (a.population ?? 0),
    )
    .map((c) => ({
      href: path({
        pathname: "/[slug]",
        params: { slug: `${serviceSlug(service, locale)}-${c.slug}` },
      }),
      label: `${name} ${tr(c, "name", locale)}`,
    }));

  return (
    <BannerLayout
      locale={locale}
      className="space-y-12 py-8"
      banner={{
        candidates: [{ scope: "service", id: service.id }],
        offer: { scope: "service", name: name.toLowerCase() },
      }}
    >
      <SetAlternates paths={localePaths(hrefFor(service))} />
      <JsonLd
        graph={[breadcrumbList(crumbs), ...(faq.length ? [faqPage(faq)] : [])]}
      />
      <header className="space-y-3">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("countryHeading", { service: name })}
        </h1>
        <p className="text-muted-foreground">
          {tc("profiles", { count: businesses.length })}
        </p>
        <InquiryButton
          serviceId={service.id}
          cities={cities
            .filter((c) => !c.parent_city_id)
            .map((c) => ({ id: c.id, name: tr(c, "name", locale) }))
            .sort((a, b) => a.name.localeCompare(b.name, locale))}
        />
      </header>

      {cityLinks.length > 0 && (
        <Section title={t("byCity", { service: name })}>
          <LinkGrid links={cityLinks} />
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
        <Section title={tc("moreResults")}>
          {/* Top 60 here; the rest are on the per-city listings. */}
          <ResultsList
            businesses={businesses.slice(0, 60)}
            cityNames={cityNames}
            serviceNames={serviceNames}
            page={1}
            pageSize={60}
            pageHrefs={[path(hrefFor(service)(locale))]}
          />
        </Section>
      )}

      {description && (
        <Section title={tl("aboutTitle", { service: name.toLowerCase() })}>
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {description}
          </p>
        </Section>
      )}
      {faq.length > 0 && (
        <Section title={tl("faqTitle")}>
          <Faq items={faq} />
        </Section>
      )}
    </BannerLayout>
  );
}
