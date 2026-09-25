import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { OG_SIZE, OgCard, ogImage } from "@/lib/og";
import { getSiteStats } from "@/lib/queries/businesses";
import { getTaxonomy } from "@/lib/queries/taxonomy";

// Default social image for every page without its own.
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tražim";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Og",
  });
  const [{ services, cities }, stats] = await Promise.all([
    getTaxonomy(),
    getSiteStats(),
  ]);
  return ogImage(
    <OgCard
      title={t("tagline")}
      subtitle={t("taglineSub")}
      stats={[
        {
          value: `${Math.floor(services.length / 10) * 10}+`,
          label: t("services"),
        },
        {
          value: String(cities.filter((c) => !c.parent_city_id).length),
          label: t("cities"),
        },
        ...(stats.businesses
          ? [
              {
                value: String(stats.businesses),
                label: t("profiles", { count: stats.businesses }),
              },
            ]
          : []),
      ]}
    />,
  );
}
