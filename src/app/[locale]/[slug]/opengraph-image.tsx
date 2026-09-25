import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { formatEur } from "@/lib/format";
import { tr } from "@/lib/i18n-fields";
import { OG_SIZE, OgCard, ogImage } from "@/lib/og";
import { listBusinesses } from "@/lib/queries/businesses";
import { getPriceStats, pickPriceStat } from "@/lib/queries/prices";
import { relatedCityIds, resolveServiceCity } from "@/lib/queries/taxonomy";

// "/vodoinstalater-podgorica": service + city, count, rating and prices.
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
  const match = await resolveServiceCity(locale, slug);
  if (!match) return ogImage(<OgCard title={t("tagline")} />);
  const { service, city } = match;

  const [businesses, stats] = await Promise.all([
    listBusinesses({
      serviceId: service.id,
      cityIds: await relatedCityIds(city),
    }),
    getPriceStats(service.id),
  ]);
  const rated = businesses.filter((b) => b.ratingCount > 0);
  const reviews = rated.reduce((n, b) => n + b.ratingCount, 0);
  const avg = reviews
    ? rated.reduce((n, b) => n + b.rating * b.ratingCount, 0) / reviews
    : 0;
  const price = pickPriceStat(stats, city.id) ?? pickPriceStat(stats, 0);

  return ogImage(
    <OgCard
      eyebrow={tr(city, "name", locale)}
      title={`${tr(service, "name", locale)} ${tr(city, "name", locale)}`}
      subtitle={t("taglineSub")}
      stats={[
        ...(businesses.length
          ? [
              {
                value: String(businesses.length),
                label: t("profiles", { count: businesses.length }),
              },
            ]
          : []),
        ...(reviews
          ? [{ star: true, value: `${avg.toFixed(1)}`, label: t("rating") }]
          : []),
        ...(price?.price_min != null
          ? [
              {
                value: formatEur(Number(price.price_min), locale),
                label: t("priceFrom"),
              },
            ]
          : []),
      ]}
    />,
  );
}
