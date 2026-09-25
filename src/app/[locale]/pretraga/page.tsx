import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ResultsList } from "@/components/business/results-list";
import { SetAlternates } from "@/components/layout/alternates";
import { SearchBar } from "@/components/search/search-bar";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import {
  exactService,
  normalize,
  SEARCH_FILTERS,
  searchBusinesses,
  type SearchFilter,
} from "@/lib/queries/search";
import { getTaxonomy, nameMaps, serviceSlug } from "@/lib/queries/taxonomy";
import { localePaths } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/pretraga">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "SearchResults",
  });
  // Result pages are endless combinations; the listing pages are what we index.
  return { title: t("title"), robots: { index: false, follow: true } };
}

const one = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.trim() ?? "";

export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[locale]/pretraga">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const sp = await searchParams;
  const q = one(sp.q).slice(0, 100);
  const grad = one(sp.grad);
  const kategorija = one(sp.kategorija);
  const filter = SEARCH_FILTERS.includes(one(sp.filter) as SearchFilter)
    ? (one(sp.filter) as SearchFilter)
    : null;

  const { groups, cities } = await getTaxonomy();
  // "grad" is a slug from the search bar, or a typed town name without JS.
  const city =
    cities.find((c) => c.slug === grad) ??
    cities.find((c) =>
      [c.name_me, c.name_en, c.name_ru].some(
        (n) => normalize(n) === normalize(grad),
      ),
    ) ??
    null;
  const group = groups.find((g) => g.slug === kategorija) ?? null;
  const path = (href: Parameters<typeof getPathname>[0]["href"]) =>
    getPathname({ locale, href });

  // Straight to the indexed listing page when the search names one: an exact
  // service (with or without a city) or just a city. Availability filters
  // only exist here, so a filtered search stays on this page.
  if (!filter) {
    const service = await exactService(q, group?.id ?? null);
    if (service && city)
      redirect(
        path({
          pathname: "/[slug]",
          params: { slug: `${serviceSlug(service, locale)}-${city.slug}` },
        }),
      );
    if (service)
      redirect(
        path({
          pathname: "/usluge/[service]",
          params: { service: serviceSlug(service, locale) },
        }),
      );
    if (!q && !group && city)
      redirect(
        path({ pathname: "/gradovi/[city]", params: { city: city.slug } }),
      );
  }

  const t = await getTranslations({ locale, namespace: "SearchResults" });
  const { cityNames, serviceNames } = await nameMaps(locale);
  const { businesses, matchedServices } = await searchBusinesses(
    { q, city, groupId: group?.id ?? null },
    locale,
  );

  const serviceHref = (service: (typeof matchedServices)[number]) =>
    city
      ? path({
          pathname: "/[slug]",
          params: { slug: `${serviceSlug(service, locale)}-${city.slug}` },
        })
      : path({
          pathname: "/usluge/[service]",
          params: { service: serviceSlug(service, locale) },
        });
  const subtitle = [
    city && tr(city, "name", locale),
    group && tr(group, "name", locale),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <SetAlternates paths={localePaths("/pretraga")} />
      <SearchBar
        locale={locale}
        defaults={{
          q,
          grad: city?.slug,
          kategorija: group?.slug,
        }}
      />

      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {q ? t("heading", { q }) : t("headingAll")}
        </h1>
        {/* With a filter the list narrows in the browser, so skip the total. */}
        <p className="text-muted-foreground">
          {[filter ? null : t("count", { count: businesses.length }), subtitle]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {matchedServices.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {t("matchingServices")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {matchedServices.slice(0, 8).map((s) => (
              <li key={s.id}>
                <a
                  href={serviceHref(s)}
                  className="inline-flex h-9 items-center rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-accent"
                >
                  {tr(s, "name", locale)}
                  {city && ` ${tr(city, "name", locale)}`}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {businesses.length > 0 ? (
        <ResultsList
          businesses={businesses}
          cityNames={cityNames}
          serviceNames={serviceNames}
          page={1}
          pageSize={businesses.length}
          pageHrefs={[]}
          initialFilters={filter ? [filter] : []}
        />
      ) : (
        <div className="space-y-3 rounded-2xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground">{t("empty")}</p>
          <Link
            href="/usluge"
            className="font-semibold text-primary hover:underline"
          >
            {t("browseAll")} →
          </Link>
        </div>
      )}
    </main>
  );
}
