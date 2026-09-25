import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";

// Private areas and endless search results stay out; everything public is
// open to search engines and AI assistants (search, user fetches and training
// alike: for a young brand, being known to the models helps).
const PRIVATE_ROUTES = [
  "/panel",
  "/admin",
  "/moj-nalog",
  "/prijava",
  "/pretraga",
] as const;

/** "/panel$" and "/panel/" per locale, so slugs that merely start with it stay crawlable. */
const disallow = [
  "/api/",
  "/r/",
  ...routing.locales.flatMap((locale) =>
    PRIVATE_ROUTES.flatMap((href) => {
      const path = getPathname({ locale, href });
      return [`${path}$`, `${path}/`];
    }),
  ),
];

const NAMED_BOTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Same rules as *, named so it's explicit that they're welcome.
      { userAgent: NAMED_BOTS, allow: "/", disallow },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
