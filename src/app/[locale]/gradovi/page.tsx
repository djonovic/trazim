import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/common/section";
import { SetAlternates } from "@/components/layout/alternates";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { getCoverage } from "@/lib/queries/businesses";
import { getTaxonomy } from "@/lib/queries/taxonomy";
import { localePaths, pageMetadata } from "@/lib/seo/metadata";
import { BannerLayout } from "@/components/layout/banner-layout";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gradovi">) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Metadata",
  });
  return pageMetadata({
    locale: locale as Locale,
    paths: localePaths("/gradovi"),
    title: t("citiesTitle"),
    description: t("citiesDescription"),
  });
}

export default async function CitiesPage({
  params,
}: PageProps<"/[locale]/gradovi">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Cities" });
  const { cities, regions } = await getTaxonomy();
  const coverage = await getCoverage();

  return (
    <BannerLayout
      locale={locale}
      className="space-y-10 py-8"
      banner={{
        candidates: [{ scope: "home", id: null }],
        offer: { scope: "home" },
      }}
    >
      <SetAlternates paths={localePaths("/gradovi")} />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground">{t("subheading")}</p>
      </header>
      <div className="grid gap-10 md:grid-cols-3">
        {regions.map((region) => (
          <Section
            key={region.id}
            title={tr(region, "name", locale)}
            className="[&_h2]:text-lg"
          >
            <ul className="space-y-3">
              {cities
                .filter((c) => c.region_id === region.id && !c.parent_city_id)
                .map((c) => {
                  const settlements = cities.filter(
                    (s) => s.parent_city_id === c.id,
                  );
                  return (
                    <li key={c.id}>
                      <div className="flex justify-between gap-3">
                        <Link
                          href={{
                            pathname: "/gradovi/[city]",
                            params: { city: c.slug },
                          }}
                          className="font-semibold hover:text-primary hover:underline"
                        >
                          {tr(c, "name", locale)}
                        </Link>
                        {coverage.perCity[c.id] ? (
                          <span className="text-sm text-muted-foreground tabular-nums">
                            {coverage.perCity[c.id]}
                          </span>
                        ) : null}
                      </div>
                      {settlements.length > 0 && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {settlements.map((s, i) => (
                            <span key={s.id}>
                              {i > 0 && ", "}
                              <Link
                                href={{
                                  pathname: "/gradovi/[city]",
                                  params: { city: s.slug },
                                }}
                                className="hover:text-foreground hover:underline"
                              >
                                {tr(s, "name", locale)}
                              </Link>
                            </span>
                          ))}
                        </p>
                      )}
                    </li>
                  );
                })}
            </ul>
          </Section>
        ))}
      </div>
    </BannerLayout>
  );
}
