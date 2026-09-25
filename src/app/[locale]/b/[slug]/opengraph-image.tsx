import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { OG_SIZE, OgCard, ogImage, photoForOg } from "@/lib/og";
import { getBusinessProfile } from "@/lib/queries/businesses";
import { getTaxonomy } from "@/lib/queries/taxonomy";

// Business profile: name, city, main service, rating and the cover photo.
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
  const business = await getBusinessProfile(slug);
  if (!business) return ogImage(<OgCard title={t("tagline")} />);

  const { services, cities } = await getTaxonomy();
  const city = cities.find((c) => c.id === business.city_id);
  const primary =
    business.business_services.find((s) => s.is_primary) ??
    business.business_services[0];
  const service = services.find((s) => s.id === primary?.service_id);
  const photo = await photoForOg(business.photos[0]?.url);

  return ogImage(
    <OgCard
      eyebrow={business.verified_at ? t("verified") : undefined}
      eyebrowCheck
      title={business.name}
      subtitle={[
        service && tr(service, "name", locale),
        city && tr(city, "name", locale),
      ]
        .filter(Boolean)
        .join(" · ")}
      stats={
        business.rating_count
          ? [
              {
                star: true,
                value: `${Number(business.rating_avg).toFixed(1)}`,
                label: t("rating"),
              },
              {
                value: String(business.rating_count),
                label: t("reviews", { count: business.rating_count }),
              },
            ]
          : []
      }
      photo={photo}
    />,
  );
}
