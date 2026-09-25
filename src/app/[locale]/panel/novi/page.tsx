import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SetAlternates } from "@/components/layout/alternates";
import { BusinessWizard } from "@/components/panel/business-wizard";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { getTaxonomy } from "@/lib/queries/taxonomy";
import { localePaths } from "@/lib/seo/metadata";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "dj");

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/panel/novi">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Wizard",
  });
  return { title: t("title"), robots: { index: false, follow: true } };
}

/** Open without an account: the wizard asks for sign-in only when publishing. */
export default async function NewBusinessPage({
  params,
}: PageProps<"/[locale]/panel/novi">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Wizard" });
  const { groups, services, cities, regions } = await getTaxonomy();

  const wizardServices = services.map((s) => {
    const group = groups.find((g) => g.id === s.group_id)!;
    return {
      id: s.id,
      name: tr(s, "name", locale),
      group: tr(group, "name", locale),
      // Search in every language, so "plumber" and "vodoinstalater" both work.
      search: norm(`${s.name_me} ${s.name_en} ${s.name_ru} ${s.slug_me}`),
    };
  });
  const wizardCities = [...cities]
    .sort(
      (a, b) =>
        Number(a.parent_city_id != null) - Number(b.parent_city_id != null) ||
        tr(a, "name", locale).localeCompare(tr(b, "name", locale), locale),
    )
    .map((c) => ({
      id: c.id,
      name: tr(c, "name", locale),
      region: tr(
        regions.find((r) => r.id === c.region_id)!,
        "name",
        locale,
      ),
      parentId: c.parent_city_id,
    }));

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:py-12">
      <SetAlternates paths={localePaths("/panel/novi")} />
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>
      <BusinessWizard
        services={wizardServices}
        cities={wizardCities}
        regions={regions.map((r) => tr(r, "name", locale))}
      />
    </main>
  );
}
