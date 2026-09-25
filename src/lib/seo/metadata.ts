import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { hreflang, routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";

type Href = Parameters<typeof getPathname>[0]["href"];

export type LocalePaths = Record<Locale, string>;

/** Localized path of the same page in every locale ("/usluge", "/en/services", …). */
export function localePaths(
  href: Href | ((locale: Locale) => Href),
): LocalePaths {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      getPathname({
        locale,
        href: typeof href === "function" ? href(locale) : href,
      }),
    ]),
  ) as LocalePaths;
}

const ogLocale: Record<Locale, string> = {
  "sr-Latn-ME": "sr_ME",
  en: "en_US",
  ru: "ru_RU",
};

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function pageMetadata(opts: {
  locale: Locale;
  paths: LocalePaths;
  title: string;
  description: string;
  /** Empty or thin pages: keep them out of the index but let links count. */
  noindex?: boolean;
  /** Skip the " | Tražim" template (home page). */
  absoluteTitle?: boolean;
}): Metadata {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales)
    languages[hreflang[locale]] = absoluteUrl(opts.paths[locale]);
  languages["x-default"] = absoluteUrl(opts.paths[routing.defaultLocale]);

  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: absoluteUrl(opts.paths[opts.locale]), languages },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: "Tražim",
      title: opts.title,
      description: opts.description,
      url: absoluteUrl(opts.paths[opts.locale]),
      locale: ogLocale[opts.locale],
      alternateLocale: routing.locales
        .filter((l) => l !== opts.locale)
        .map((l) => ogLocale[l]),
    },
    // Images come from the opengraph-image files of each route.
    twitter: { card: "summary_large_image" },
  };
}
