import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { LinkGrid, Section } from "@/components/common/section";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatEur } from "@/lib/format";
import { tr } from "@/lib/i18n-fields";
import { getAllPriceStats } from "@/lib/queries/prices";
import { getTaxonomy, serviceSlug } from "@/lib/queries/taxonomy";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { localePaths, pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 21600;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cijene">) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Metadata",
  });
  const stats = await getAllPriceStats();
  return pageMetadata({
    locale: locale as Locale,
    paths: localePaths("/cijene"),
    title: t("pricesTitle", { year: new Date().getFullYear() }),
    description: t("pricesDescription"),
    noindex: stats.length === 0,
  });
}

export default async function PricesPage({
  params,
}: PageProps<"/[locale]/cijene">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Prices" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const format = await getFormatter({ locale });
  const [{ services }, stats] = await Promise.all([
    getTaxonomy(),
    getAllPriceStats(),
  ]);

  // Country-level row per service, most data first.
  const country = stats
    .filter((s) => s.city_key === 0)
    .sort((a, b) => (b.items_count ?? 0) - (a.items_count ?? 0));
  const seen = new Set<number>();
  const rows = country.flatMap((s) => {
    if (seen.has(s.service_id!)) return [];
    seen.add(s.service_id!);
    const service = services.find((x) => x.id === s.service_id);
    return service ? [{ service, stat: s }] : [];
  });
  const href = (slug: string) => ({
    pathname: "/cijene/[slug]" as const,
    params: { slug },
  });

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-8">
      <SetAlternates paths={localePaths("/cijene")} />
      <JsonLd
        graph={[
          breadcrumbList([
            { name: tc("siteName"), href: getPathname({ locale, href: "/" }) },
            {
              name: t("heading"),
              href: getPathname({ locale, href: "/cijene" }),
            },
          ]),
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground">
          {t("updated", {
            date: format.dateTime(new Date(), {
              month: "long",
              year: "numeric",
            }),
          })}
        </p>
        <p className="max-w-2xl text-muted-foreground">{t("intro")}</p>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <>
          <Section title={t("popular")}>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rows.slice(0, 9).map(({ service, stat }) => (
                <li key={service.id}>
                  <Link
                    href={href(serviceSlug(service, locale))}
                    className="flex h-16 items-center justify-between gap-3 rounded-xl border bg-white px-4 hover:border-primary/40"
                  >
                    <span className="font-semibold">
                      {tr(service, "name", locale)}
                    </span>
                    <span className="font-semibold whitespace-nowrap text-primary">
                      {tc("priceFrom", {
                        price: formatEur(Number(stat.price_min), locale),
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
          <Section title={t("all")}>
            <LinkGrid
              links={rows.map(({ service }) => ({
                href: getPathname({
                  locale,
                  href: href(serviceSlug(service, locale)),
                }),
                label: tr(service, "name", locale),
              }))}
            />
          </Section>
        </>
      )}

      <Link
        href="/statistika"
        className="inline-block font-semibold text-primary hover:underline"
      >
        {t("statsCta")} →
      </Link>
    </main>
  );
}
