import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { POPULAR_CITY_SLUGS, POPULAR_SERVICE_SLUGS } from "@/lib/popular";
import { getTaxonomy, serviceSlug } from "@/lib/queries/taxonomy";
import {
  SearchBarForm,
  type SearchCity,
  type SearchService,
} from "./search-bar-form";

/** Same folding as search_normalize() in SQL: "Čišćenje" → "ciscenje". */
const fold = (s: string) =>
  s
    .replace(/đ/g, "dj")
    .replace(/Đ/g, "Dj")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Search bar: "what" (service or business name, with suggestions), "where"
 * (town, with suggestions) and category. Picking a service goes straight to
 * its listing; anything else searches on /pretraga. A plain GET form under
 * the hood, so it also works without JavaScript.
 */
export async function SearchBar({
  locale,
  defaults = {},
  className,
}: {
  locale: Locale;
  defaults?: { q?: string; grad?: string; kategorija?: string };
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "SearchBar" });
  const { groups, services, cities } = await getTaxonomy();

  const serviceOptions: SearchService[] = services.map((s) => ({
    slug: serviceSlug(s, locale),
    name: tr(s, "name", locale),
    group: tr(
      groups.find((g) => g.id === s.group_id)!,
      "name",
      locale,
    ),
    // Match in every language, so "plumber" also finds Vodoinstalater.
    search: fold(`${s.name_me} ${s.name_en} ${s.name_ru} ${s.slug_me}`),
    names: [
      s.name_me,
      s.name_en,
      s.name_ru,
      s.slug_me,
      s.slug_en,
      s.slug_ru,
    ].map((n) => fold(n).replace(/-/g, " ")),
    popular: POPULAR_SERVICE_SLUGS.indexOf(s.slug_me),
  }));
  const municipality = (id: number | null) =>
    id ? cities.find((c) => c.id === id) : undefined;
  const cityOptions: SearchCity[] = cities.map((c) => ({
    slug: c.slug,
    name: tr(c, "name", locale),
    parent: municipality(c.parent_city_id)
      ? tr(municipality(c.parent_city_id)!, "name", locale)
      : null,
    search: fold(`${c.name_me} ${c.name_en} ${c.name_ru} ${c.slug}`),
    names: [c.name_me, c.name_en, c.name_ru, c.slug].map((n) =>
      fold(n).replace(/-/g, " "),
    ),
    popular: POPULAR_CITY_SLUGS.indexOf(c.slug),
  }));

  return (
    <SearchBarForm
      className={className}
      action={getPathname({ locale, href: "/pretraga" })}
      services={serviceOptions}
      cities={cityOptions}
      categories={groups.map((g) => ({
        slug: g.slug,
        name: tr(g, "name", locale),
      }))}
      defaults={defaults}
      labels={{
        label: t("label"),
        what: t("what"),
        whatPlaceholder: t("whatPlaceholder"),
        where: t("where"),
        wherePlaceholder: t("wherePlaceholder"),
        whole: t("whole"),
        allCategories: t("allCategories"),
        popularServices: t("popularServices"),
        popularCities: t("popularCities"),
        services: t("services"),
        cities: t("cities"),
        searchFor: t("searchFor", { q: "__Q__" }),
        noCity: t("noCity"),
        clear: t("clear"),
        submit: t("submit"),
      }}
    />
  );
}
