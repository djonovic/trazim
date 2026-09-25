import "server-only";
import { after } from "next/server";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";

/**
 * Tells Bing/Yandex (IndexNow) that pages changed, so they're recrawled in
 * minutes; Bing also feeds Copilot and part of ChatGPT search. Google doesn't
 * use IndexNow (it reads the sitemap). No-op without INDEXNOW_KEY or on
 * localhost. Runs after the response, so it never slows down the action.
 */
export function pingIndexNow(paths: string[]) {
  const key = process.env.INDEXNOW_KEY;
  const host = new URL(siteUrl).host;
  if (!key || !paths.length || /^(localhost|127\.)/.test(host)) return;
  after(async () => {
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host,
          key,
          keyLocation: new URL("/indexnow-key.txt", siteUrl).toString(),
          urlList: [...new Set(paths)].map((p) =>
            new URL(p, siteUrl).toString(),
          ),
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok && res.status !== 202)
        console.error("IndexNow failed", res.status);
    } catch (e) {
      console.error("IndexNow failed", (e as Error).message);
    }
  });
}

/** A business profile in every language. */
export function profilePaths(slug: string) {
  return routing.locales.map((locale) =>
    getPathname({ locale, href: { pathname: "/b/[slug]", params: { slug } } }),
  );
}
