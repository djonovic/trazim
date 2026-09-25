import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Section } from "@/components/common/section";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatEur } from "@/lib/format";
import { tr } from "@/lib/i18n-fields";
import { listBusinesses } from "@/lib/queries/businesses";
import { getAllPriceStats } from "@/lib/queries/prices";
import { getTaxonomy, serviceSlug, type Service } from "@/lib/queries/taxonomy";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { absoluteUrl, localePaths, pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 21600;

// A ranking only counts services with at least this many businesses behind it.
// Kept low while the catalogue is small; raise to ~5 once there is real data.
const MIN_BUSINESSES = 1;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/statistika">) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Metadata",
  });
  return pageMetadata({
    locale: locale as Locale,
    paths: localePaths("/statistika"),
    title: t("statsTitle"),
    description: t("statsDescription"),
  });
}

type Row = { service: Service; value: number };

export default async function StatisticsPage({
  params,
}: PageProps<"/[locale]/statistika">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Stats" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const format = await getFormatter({ locale });
  const [{ services }, stats, businesses] = await Promise.all([
    getTaxonomy(),
    getAllPriceStats(),
    listBusinesses({ limit: 1000 }),
  ]);
  const byId = new Map(services.map((s) => [s.id, s]));
  const computedAt = stats.find((s) => s.computed_at)?.computed_at ?? null;

  const ranking = (unit: "hour" | "job"): Row[] =>
    stats
      .filter(
        (s) =>
          s.city_key === 0 &&
          s.unit === unit &&
          (s.businesses_count ?? 0) >= MIN_BUSINESSES,
      )
      .flatMap((s) => {
        const service = byId.get(s.service_id!);
        return service ? [{ service, value: Number(s.price_median) }] : [];
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

  const views = new Map<number, { total: number; count: number }>();
  for (const b of businesses) {
    for (const id of b.serviceIds) {
      const v = views.get(id) ?? { total: 0, count: 0 };
      v.total += b.views;
      v.count += 1;
      views.set(id, v);
    }
  }
  const mostViewed: Row[] = [...views.entries()]
    .filter(([, v]) => v.count >= MIN_BUSINESSES)
    .flatMap(([id, v]) => {
      const service = byId.get(id);
      return service ? [{ service, value: Math.round(v.total / v.count) }] : [];
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const priceHref = (s: Service) =>
    getPathname({
      locale,
      href: {
        pathname: "/cijene/[slug]",
        params: { slug: serviceSlug(s, locale) },
      },
    });
  const listHref = (s: Service) =>
    getPathname({
      locale,
      href: {
        pathname: "/usluge/[service]",
        params: { service: serviceSlug(s, locale) },
      },
    });

  const lists = [
    {
      title: t("hourly"),
      sub: t("hourlySub"),
      rows: ranking("hour"),
      money: true,
      href: priceHref,
    },
    {
      title: t("jobs"),
      sub: t("jobsSub"),
      rows: ranking("job"),
      money: true,
      href: priceHref,
    },
    {
      title: t("viewed"),
      sub: t("viewedSub"),
      rows: mostViewed,
      money: false,
      href: listHref,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <SetAlternates paths={localePaths("/statistika")} />
      <JsonLd
        graph={[
          { "@type": "CollectionPage", name: t("heading") },
          // Market numbers as a citable dataset (Google Dataset Search, AI engines).
          {
            "@type": "Dataset",
            name: t("heading"),
            description: t("intro", {
              date: format.dateTime(new Date(), {
                month: "long",
                year: "numeric",
              }),
            }),
            url: absoluteUrl(getPathname({ locale, href: "/statistika" })),
            ...(computedAt ? { dateModified: computedAt } : {}),
            temporalCoverage: String(new Date().getFullYear()),
            spatialCoverage: { "@type": "Country", name: "Montenegro" },
            creator: { "@id": absoluteUrl("/#organization") },
            license: "https://creativecommons.org/licenses/by/4.0/",
            isAccessibleForFree: true,
          },
          breadcrumbList([
            { name: tc("siteName"), href: getPathname({ locale, href: "/" }) },
            {
              name: t("heading"),
              href: getPathname({ locale, href: "/statistika" }),
            },
          ]),
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground">
          {t("intro", {
            date: format.dateTime(new Date(), {
              month: "long",
              year: "numeric",
            }),
          })}
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-3">
        {lists.map((list) => (
          <Section
            key={list.title}
            title={list.title}
            className="rounded-2xl border bg-card p-5 [&_h2]:text-lg"
          >
            <p className="-mt-2 text-sm text-muted-foreground">{list.sub}</p>
            {list.rows.length ? (
              <ol className="space-y-2">
                {list.rows.map((row, i) => (
                  <li
                    key={row.service.id}
                    className="flex items-baseline gap-3 text-[15px]"
                  >
                    <span className="w-5 text-right text-sm text-muted-foreground tabular-nums">
                      {i + 1}.
                    </span>
                    <a
                      href={list.href(row.service)}
                      className="flex-1 hover:text-primary hover:underline"
                    >
                      {tr(row.service, "name", locale)}
                    </a>
                    <span className="font-semibold tabular-nums">
                      {list.money ? formatEur(row.value, locale) : row.value}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">{t("empty")}</p>
            )}
          </Section>
        ))}
      </div>
    </main>
  );
}
