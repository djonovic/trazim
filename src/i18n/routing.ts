import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sr-Latn-ME", "en", "ru"],
  defaultLocale: "sr-Latn-ME",
  localePrefix: "as-needed",
  localeDetection: false,
  // Language comes from the URL only; no cookie to disclose or to vary on.
  localeCookie: false,
  // Service slugs differ per locale, so the middleware can't compute
  // alternates for dynamic pages; pages emit hreflang via metadata instead.
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/usluge": { "sr-Latn-ME": "/usluge", en: "/services", ru: "/uslugi" },
    "/usluge/[service]": {
      "sr-Latn-ME": "/usluge/[service]",
      en: "/services/[service]",
      ru: "/uslugi/[service]",
    },
    "/gradovi": { "sr-Latn-ME": "/gradovi", en: "/cities", ru: "/goroda" },
    "/gradovi/[city]": {
      "sr-Latn-ME": "/gradovi/[city]",
      en: "/cities/[city]",
      ru: "/goroda/[city]",
    },
    // "/{service}-{city}", e.g. /vodoinstalater-podgorica, /en/plumber-podgorica
    "/[slug]": "/[slug]",
    "/[slug]/[page]": "/[slug]/[page]",
    "/b/[slug]": "/b/[slug]",
    "/cijene": { "sr-Latn-ME": "/cijene", en: "/prices", ru: "/ceny" },
    "/cijene/[slug]": {
      "sr-Latn-ME": "/cijene/[slug]",
      en: "/prices/[slug]",
      ru: "/ceny/[slug]",
    },
    "/statistika": {
      "sr-Latn-ME": "/statistika",
      en: "/statistics",
      ru: "/statistika",
    },
    "/za-biznise": {
      "sr-Latn-ME": "/za-biznise",
      en: "/for-business",
      ru: "/dlya-biznesa",
    },
    "/kako-rangiramo": {
      "sr-Latn-ME": "/kako-rangiramo",
      en: "/how-we-rank",
      ru: "/kak-my-ranzhiruem",
    },
    "/kako-funkcionise": {
      "sr-Latn-ME": "/kako-funkcionise",
      en: "/how-it-works",
      ru: "/kak-eto-rabotaet",
    },
    "/pomoc": { "sr-Latn-ME": "/pomoc", en: "/help", ru: "/pomoshch" },
    "/bezbjednost": {
      "sr-Latn-ME": "/bezbjednost",
      en: "/safety",
      ru: "/bezopasnost",
    },
    "/o-nama": { "sr-Latn-ME": "/o-nama", en: "/about", ru: "/o-nas" },
    "/kontakt": { "sr-Latn-ME": "/kontakt", en: "/contact", ru: "/kontakty" },
    "/uslovi": { "sr-Latn-ME": "/uslovi", en: "/terms", ru: "/usloviya" },
    "/privatnost": {
      "sr-Latn-ME": "/privatnost",
      en: "/privacy",
      ru: "/konfidentsialnost",
    },
    "/kolacici": { "sr-Latn-ME": "/kolacici", en: "/cookies", ru: "/cookies" },
    "/pretraga": { "sr-Latn-ME": "/pretraga", en: "/search", ru: "/poisk" },
    "/prijava": { "sr-Latn-ME": "/prijava", en: "/login", ru: "/vhod" },
    "/moj-nalog": {
      "sr-Latn-ME": "/moj-nalog",
      en: "/my-account",
      ru: "/moy-akkaunt",
    },
    "/panel": "/panel",
    "/panel/novi": {
      "sr-Latn-ME": "/panel/novi",
      en: "/panel/new",
      ru: "/panel/novyy",
    },
    "/panel/[id]": "/panel/[id]",
    // Internal tool, Montenegrin only; same path in every locale.
    "/admin": "/admin",
    "/admin/profili": "/admin/profili",
    "/admin/profili/[id]": "/admin/profili/[id]",
    "/admin/recenzije": "/admin/recenzije",
    "/admin/prijave": "/admin/prijave",
    "/admin/upiti": "/admin/upiti",
    "/admin/sponzorstva": "/admin/sponzorstva",
    "/admin/baneri": "/admin/baneri",
  },
});

export type Locale = (typeof routing.locales)[number];

/** hreflang values (Google doesn't accept script subtags like sr-Latn-ME). */
export const hreflang: Record<Locale, string> = {
  "sr-Latn-ME": "sr-ME",
  en: "en",
  ru: "ru",
};
