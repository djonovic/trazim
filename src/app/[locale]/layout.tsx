import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AlternatesProvider } from "@/components/layout/alternates";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SearchProvider } from "@/components/search/search-dialog";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";
import { tr } from "@/lib/i18n-fields";
import { POPULAR_CITY_SLUGS, POPULAR_SERVICE_SLUGS } from "@/lib/popular";
import { getTaxonomy, serviceSlug } from "@/lib/queries/taxonomy";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: "%s | Tražim" },
    description: t("description"),
    // Search Console / Bing Webmaster / Yandex ownership tokens, set per deploy.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const { services, cities } = await getTaxonomy();
  const popularServices = POPULAR_SERVICE_SLUGS.flatMap((slug) => {
    const s = services.find((x) => x.slug_me === slug);
    return s
      ? [{ slug: serviceSlug(s, locale), name: tr(s, "name", locale) }]
      : [];
  });
  const popularCities = POPULAR_CITY_SLUGS.flatMap((slug) => {
    const c = cities.find((x) => x.slug === slug);
    return c ? [{ slug: c.slug, name: tr(c, "name", locale) }] : [];
  });

  return (
    <html lang={locale} className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <AlternatesProvider>
            <AuthProvider>
              <SearchProvider
                popularServices={popularServices}
                popularCities={popularCities}
              >
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </SearchProvider>
            </AuthProvider>
          </AlternatesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
