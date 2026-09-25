import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { OG_SIZE, OgCard, ogImage } from "@/lib/og";
import { getCityBySlug } from "@/lib/queries/taxonomy";
import { getIndexability } from "@/lib/seo/indexable";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tražim";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale: raw, city: slug } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "Og" });
  const city = await getCityBySlug(slug);
  if (!city) return ogImage(<OgCard title={t("tagline")} />);
  const { coverage } = await getIndexability();
  const count = coverage.perCity[city.id] ?? 0;
  return ogImage(
    <OgCard
      eyebrow={t("tagline")}
      title={tr(city, "name", locale)}
      subtitle={t("taglineSub")}
      stats={
        count ? [{ value: String(count), label: t("profiles", { count }) }] : []
      }
    />,
  );
}
