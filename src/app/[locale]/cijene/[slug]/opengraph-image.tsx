import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { formatEur } from "@/lib/format";
import { tr } from "@/lib/i18n-fields";
import { OG_SIZE, OgCard, ogImage } from "@/lib/og";
import { getPriceStats, pickPriceStat } from "@/lib/queries/prices";
import { getServiceBySlug, resolveServiceCity } from "@/lib/queries/taxonomy";

// Price guide: "Koliko košta …" with average and range.
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tražim";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "Og" });
  const tu = await getTranslations({ locale, namespace: "Units" });
  const service = await getServiceBySlug(locale, slug);
  const match = service
    ? { service, city: null }
    : await resolveServiceCity(locale, slug);
  if (!match) return ogImage(<OgCard title={t("tagline")} />);

  const stat = pickPriceStat(
    await getPriceStats(match.service.id),
    match.city?.id ?? 0,
  );
  const where = match.city ? tr(match.city, "name", locale) : null;
  return ogImage(
    <OgCard
      eyebrow={`${t("priceGuide")} ${new Date().getFullYear()}`}
      title={[tr(match.service, "name", locale), where]
        .filter(Boolean)
        .join(" ")}
      subtitle={t("taglineSub")}
      stats={
        stat?.price_avg != null
          ? [
              {
                value: `${formatEur(Number(stat.price_avg), locale)} ${tu(stat.unit!)}`,
                label: t("avgPrice"),
              },
              {
                value: `${formatEur(Number(stat.price_min), locale)}–${formatEur(Number(stat.price_max), locale)}`,
                label: "min–max",
              },
            ]
          : []
      }
    />,
  );
}
