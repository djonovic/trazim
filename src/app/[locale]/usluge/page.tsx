import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/common/section";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { getCoverage } from "@/lib/queries/businesses";
import { getTaxonomy, serviceSlug } from "@/lib/queries/taxonomy";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { absoluteUrl, localePaths, pageMetadata } from "@/lib/seo/metadata";
import { BannerLayout } from "@/components/layout/banner-layout";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/usluge">) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Metadata",
  });
  return pageMetadata({
    locale: locale as Locale,
    paths: localePaths("/usluge"),
    title: t("servicesTitle"),
    description: t("servicesDescription"),
  });
}

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/usluge">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Services" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const { groups, services } = await getTaxonomy();
  const coverage = await getCoverage();
  const href = (slug: string) => ({
    pathname: "/usluge/[service]" as const,
    params: { service: slug },
  });

  return (
    <BannerLayout
      locale={locale}
      className="space-y-10 py-8"
      banner={{
        candidates: [{ scope: "home", id: null }],
        offer: { scope: "home" },
      }}
    >
      <SetAlternates paths={localePaths("/usluge")} />
      <JsonLd
        graph={[
          {
            "@type": "CollectionPage",
            name: t("heading"),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: services.map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: tr(s, "name", locale),
                url: absoluteUrl(
                  getPathname({ locale, href: href(serviceSlug(s, locale)) }),
                ),
              })),
            },
          },
          breadcrumbList([
            { name: tc("siteName"), href: getPathname({ locale, href: "/" }) },
            {
              name: t("heading"),
              href: getPathname({ locale, href: "/usluge" }),
            },
          ]),
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground">
          {t("subheading", { count: services.length, groups: groups.length })}
        </p>
      </header>
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
        {groups.map((g) => (
          <Section
            key={g.id}
            id={g.slug}
            title={tr(g, "name", locale)}
            className="mb-10 scroll-mt-24 break-inside-avoid [&_h2]:text-lg"
          >
            <ul className="space-y-1.5 text-[15px]">
              {g.services.map((s) => (
                <li key={s.id} className="flex justify-between gap-3">
                  <Link
                    href={href(serviceSlug(s, locale))}
                    className="hover:text-primary hover:underline"
                  >
                    {tr(s, "name", locale)}
                  </Link>
                  {coverage.perService[s.id] ? (
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {coverage.perService[s.id]}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ))}
      </div>
    </BannerLayout>
  );
}
