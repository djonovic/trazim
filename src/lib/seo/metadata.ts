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
  /**
   * Share image path for routes without an opengraph-image file of their own
   * (default: the site image). `false` when the route has one: an explicit
   * image here would override it.
   */
  image?: string | false;
}): Metadata {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales)
    languages[hreflang[locale]] = absoluteUrl(opts.paths[locale]);
  languages["x-default"] = absoluteUrl(opts.paths[routing.defaultLocale]);

  // Without this, static pages and listing page 2+ would have no image at
  // all: a child's openGraph replaces the layout's whole object.
  const images =
    opts.image === false
      ? undefined
      : [
          {
            url: absoluteUrl(opts.image ?? `/${opts.locale}/opengraph-image`),
            width: 1200,
            height: 630,
            alt: "Tražim",
            type: "image/png",
          },
        ];

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
      // Leave the key out entirely when the route has its own image file:
      // even `images: undefined` would drop the file-based image.
      ...(images && { images }),
    },
    twitter: { card: "summary_large_image", ...(images && { images }) },
  };
}
