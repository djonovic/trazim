import type { Locale } from "@/i18n/routing";

export function formatEur(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

/** 10+ / 20+ / 50+ / 100+ … like Košnica, so exact numbers aren't exposed. */
export function viewsBucket(views: number) {
  const buckets = [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10];
  return buckets.find((b) => views >= b) ?? null;
}

/**
 * Montenegrin count phrase: "1 vodoinstalater", "21 vodoinstalater",
 * "3 vodoinstalatera", "12 vodoinstalatera". Returns null when the service
 * has no person noun (e.g. "Čišćenje"), so the caller falls back to "profila".
 */
export function countPhraseMe(
  count: number,
  nameMe: string,
  pluralGenMe: string | null,
) {
  if (!pluralGenMe) return null;
  const singular = count % 10 === 1 && count % 100 !== 11;
  return `${count} ${singular ? nameMe.toLowerCase() : pluralGenMe}`;
}

export type Hours = { weekday: number; opensAt: string; closesAt: string };

/** Current weekday (1–7) and "HH:MM" in Montenegro. */
export function nowInMontenegro(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Podgorica",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday =
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday")) +
    1;
  return { weekday, time: `${get("hour")}:${get("minute")}` };
}

export function isOpenNow(
  hours: Hours[],
  emergency24h = false,
  date = new Date(),
) {
  if (emergency24h) return true;
  const { weekday, time } = nowInMontenegro(date);
  return hours.some((h) => {
    const opens = h.opensAt.slice(0, 5);
    const closes = h.closesAt.slice(0, 5);
    if (closes > opens)
      return h.weekday === weekday && time >= opens && time < closes;
    // Past midnight, e.g. 20:00–02:00.
    const prevDay = weekday === 1 ? 7 : weekday - 1;
    return (
      (h.weekday === weekday && time >= opens) ||
      (h.weekday === prevDay && time < closes)
    );
  });
}

export function formatTime(value: string) {
  return value.slice(0, 5);
}

const MONTENEGRIN: Record<Locale, string> = {
  "sr-Latn-ME": "crnogorski",
  en: "Montenegrin",
  ru: "черногорский",
};

/** "engleski", "ruski"…; the site's own locale shows as Montenegrin, not "srpski (latinica, Crna Gora)". */
export function languageName(code: string, locale: Locale) {
  if (code === "sr-Latn-ME" || code === "cnr") return MONTENEGRIN[locale];
  return new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? code;
}

/** ICU's sr-Latn uses ekavian "pre"; Montenegrin is "prije". */
export function ijekavian(text: string, locale: Locale) {
  return locale === "sr-Latn-ME" ? text.replace(/\bpre\b/g, "prije") : text;
}

const GENITIVE_MONTHS: Partial<Record<Locale, string[]>> = {
  "sr-Latn-ME": [
    "januara",
    "februara",
    "marta",
    "aprila",
    "maja",
    "juna",
    "jula",
    "avgusta",
    "septembra",
    "oktobra",
    "novembra",
    "decembra",
  ],
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
};

/** "od septembra 2026" / "с сентября 2026" (ICU only gives the nominative "septembar"). */
export function monthYearSince(date: Date, locale: Locale) {
  const months = GENITIVE_MONTHS[locale];
  if (months)
    return `${months[date.getMonth()]} ${date.getFullYear()}.`.replace(
      /\.$/,
      locale === "ru" ? " г." : ".",
    );
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}
