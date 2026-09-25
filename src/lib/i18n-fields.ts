import type { Locale } from "@/i18n/routing";

export type LocaleKey = "me" | "en" | "ru";

export const localeKey: Record<Locale, LocaleKey> = {
  "sr-Latn-ME": "me",
  en: "en",
  ru: "ru",
};

type Localized<F extends string> = { [K in `${F}_${LocaleKey}`]: string };

/** Picks `name_me` / `name_en` / `name_ru` for the locale. */
export function tr<F extends string>(
  row: Localized<F>,
  field: F,
  locale: Locale,
): string {
  return row[`${field}_${localeKey[locale]}` as keyof Localized<F>];
}
