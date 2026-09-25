import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Only same-site paths ("/panel", "/en/b/x"). Resolves the value the way a
 * browser would, so "//evil.com", "/\\evil.com" and "/\t/evil.com" (tabs and
 * newlines are stripped by URL parsers) can't turn into open redirects.
 */
export function safeNext(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || /[\u0000-\u001f\\]/.test(value))
    return fallback;
  try {
    const base = "https://same-origin.invalid";
    const url = new URL(value, base);
    // "/a/../..//evil.com" normalizes to "//evil.com".
    if (url.origin !== base || url.pathname.startsWith("//")) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

/** The login page in the language of `path` ("/en/…" → "/en/login"). */
export function loginPathFor(path: string, locale?: Locale) {
  const segment = path.split("/")[1];
  const resolved =
    locale ??
    ((routing.locales as readonly string[]).includes(segment)
      ? (segment as Locale)
      : routing.defaultLocale);
  return getPathname({ href: "/prijava", locale: resolved });
}

/** Where Google sends the user back to. */
export function callbackUrl(origin: string, next: string) {
  return `${origin}/api/auth/callback?next=${encodeURIComponent(safeNext(next))}`;
}

/** Login page the email link opens. The token is used only after a button click. */
export function emailConfirmUrl(origin: string, path: string, next: string) {
  const url = new URL(path, origin);
  url.searchParams.set("next", safeNext(next));
  return url.toString();
}
