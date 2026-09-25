import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ListingPage, listingMetadata, listingStaticParams } from "./listing";

export const revalidate = 3600;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return listingStaticParams(params.locale as Locale);
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  return listingMetadata(locale as Locale, slug, 1);
}

export default async function Page({ params }: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  return <ListingPage locale={locale as Locale} slug={slug} page={1} />;
}
