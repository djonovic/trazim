import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type Href = Parameters<typeof getPathname>[0]["href"];

// Routes whose params mean the same thing in every locale. Service slugs
// ("/[slug]", "/usluge/[service]", "/cijene/[slug]") differ per locale and
// would need a database lookup, so those paths aren't translated.
const SAME_PARAMS = new Set([
  "/b/[slug]",
  "/gradovi/[city]",
  "/panel/[id]",
  "/admin/profili/[id]",
]);

// Fewest params first, so "/kontakt" isn't taken for "/[slug]" and
// "/b/x" isn't taken for "/[slug]/[page]".
const params = (route: string) => route.split("[").length - 1;
const ROUTES = Object.entries(routing.pathnames).sort(
  ([a], [b]) => params(a) - params(b),
);

function match(template: string, path: string) {
  const t = template.split("/").filter(Boolean);
  const p = path.split("/").filter(Boolean);
  if (t.length !== p.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < t.length; i++) {
    const name = /^\[(\w+)\]$/.exec(t[i])?.[1];
    if (name) params[name] = decodeURIComponent(p[i]);
    else if (t[i] !== p[i]) return null;
  }
  return params;
}

/**
 * The same page in another locale ("/panel/novi" → "/en/panel/new"), keeping
 * query and hash. Null when the path can't be translated without data.
 */
export function translatePath(path: string, target: Locale) {
  const url = new URL(path, "https://same-origin.invalid");
  let rest = url.pathname;
  let from: Locale = routing.defaultLocale;
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    if (rest === `/${locale}` || rest.startsWith(`/${locale}/`)) {
      from = locale;
      rest = rest.slice(locale.length + 1) || "/";
    }
  }

  for (const [href, value] of ROUTES) {
    const template = typeof value === "string" ? value : value[from];
    const values = match(template, rest);
    if (!values) continue;
    const dynamic = Object.keys(values).length > 0;
    if (dynamic && !SAME_PARAMS.has(href)) return null;
    const pathname = getPathname({
      locale: target,
      href: (dynamic ? { pathname: href, params: values } : href) as Href,
    });
    return pathname + url.search + url.hash;
  }
  return null;
}
