import { siteUrl } from "@/lib/env";
import { SITEMAP_IDS } from "../sitemaps/sitemap";

// Sitemap index: points to the per-type sitemaps in /sitemaps/sitemap/{id}.xml.
export const revalidate = 3600;

export function GET() {
  const now = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_IDS.map(
  (id) =>
    `  <sitemap><loc>${new URL(`/sitemaps/sitemap/${id}.xml`, siteUrl)}</loc><lastmod>${now}</lastmod></sitemap>`,
).join("\n")}
</sitemapindex>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
