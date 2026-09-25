import "server-only";
import { getCoverage } from "@/lib/queries/businesses";
import { getTaxonomy, type City } from "@/lib/queries/taxonomy";

/**
 * One source of truth for "does this page have real content?", shared by the
 * pages' noindex rules, the sitemap and internal links. Empty combinations
 * stay reachable for visitors (with nearby/online fallbacks) but are noindex,
 * left out of the sitemap and not linked, so crawlers don't spend time on them.
 */
export async function getIndexability() {
  const [coverage, { cities }] = await Promise.all([
    getCoverage(),
    getTaxonomy(),
  ]);

  // A municipality counts its own businesses and its settlements'. A
  // settlement (Zabjelo, Bečići…) counts only businesses that list it
  // themselves: its page also shows the municipality's businesses, but
  // indexing that would make many near-identical pages (doorway pages).
  const related = new Map<number, number[]>();
  for (const city of cities) {
    related.set(
      city.id,
      city.parent_city_id
        ? [city.id]
        : [
            city.id,
            ...cities
              .filter((c) => c.parent_city_id === city.id)
              .map((c) => c.id),
          ],
    );
  }

  /** Businesses on /{service}-{city} (not deduplicated across settlements; use as > 0). */
  const comboCount = (serviceId: number, cityId: number) =>
    (related.get(cityId) ?? [cityId]).reduce(
      (n, id) => n + (coverage.perServiceCity[`${serviceId}:${id}`] ?? 0),
      0,
    );

  return {
    coverage,
    combo: (serviceId: number, city: Pick<City, "id">) =>
      comboCount(serviceId, city.id) > 0,
    comboCount,
    service: (serviceId: number) => (coverage.perService[serviceId] ?? 0) > 0,
    city: (city: Pick<City, "id">) =>
      (related.get(city.id) ?? [city.id]).some(
        (id) => (coverage.perCity[id] ?? 0) > 0,
      ),
  };
}
