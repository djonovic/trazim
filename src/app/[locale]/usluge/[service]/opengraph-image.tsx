import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { tr } from "@/lib/i18n-fields";
import { OG_SIZE, OgCard, ogImage } from "@/lib/og";
import { getCoverage } from "@/lib/queries/businesses";
import { getServiceBySlug } from "@/lib/queries/taxonomy";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tražim";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale: raw, service: slug } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "Og" });
  const service = await getServiceBySlug(locale, slug);
  if (!service) return ogImage(<OgCard title={t("tagline")} />);
  const count = (await getCoverage()).perService[service.id] ?? 0;
  return ogImage(
    <OgCard
      eyebrow={t("tagline")}
      title={tr(service, "name", locale)}
      subtitle={t("taglineSub")}
      stats={
        count ? [{ value: String(count), label: t("profiles", { count }) }] : []
      }
    />,
  );
}
