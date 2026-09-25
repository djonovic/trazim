import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ListingPage, listingMetadata } from "../listing";

export const revalidate = 3600;

// Rendered on first request, then cached (ISR).
export function generateStaticParams() {
  return [];
}

// Page 1 lives at the bare URL; /…/1, /…/02 and non-numbers are 404s.
function parsePage(value: string) {
  return /^[2-9]\d*$|^1\d+$/.test(value) ? Number(value) : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[slug]/[page]">) {
  const { locale, slug, page } = await params;
  const n = parsePage(page);
  if (!n) notFound();
  return listingMetadata(locale as Locale, slug, n);
}

export default async function Page({
  params,
}: PageProps<"/[locale]/[slug]/[page]">) {
  const { locale, slug, page } = await params;
  const n = parsePage(page);
  if (!n) notFound();
  setRequestLocale(locale as Locale);
  return <ListingPage locale={locale as Locale} slug={slug} page={n} />;
}
