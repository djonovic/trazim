import "server-only";
import { getCoverage } from "@/lib/queries/businesses";
import { getTaxonomy, type City } from "@/lib/queries/taxonomy";

/**
 * A service×city page is indexable only with at least this many distinct
 * businesses whose home city is that place. Service-area rows (a business
 * that covers the whole country) do not count.
 */
export const MIN_LOCAL_BUSINESSES = 3;

/**
 * One source of truth for "does this page have real content?", shared by the
 * pages' noindex rules, the sitemap and internal links. Thin combinations
 * stay reachable for visitors (with nearby/online fallbacks) but are noindex,
 * left out of the sitemap and not linked, so crawlers don't spend time on them.
 */
export async function getIndexability() {
  const [coverage, { cities }] = await Promise.all([
    getCoverage(),
    getTaxonomy(),
  ]);

  // A municipality counts businesses based there and in its settlements. A
  // settlement (Zabjelo, Bečići…) counts only businesses whose home city is
  // that settlement. Its page also shows the municipality's businesses, but
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

  const sum = (
    map: Record<string, number>,
    serviceId: number,
    cityId: number,
  ) =>
    (related.get(cityId) ?? [cityId]).reduce(
      (n, id) => n + (map[`${serviceId}:${id}`] ?? 0),
      0,
    );

  /**
   * Businesses whose service area includes the city (and, for a municipality,
   * its settlements). Used for counts and inquiry reach, not for indexing.
   */
  const comboCount = (serviceId: number, cityId: number) =>
    sum(coverage.perServiceCity, serviceId, cityId);

  /** Distinct businesses physically based in the city (home city only). */
  const basedCount = (serviceId: number, cityId: number) =>
    sum(coverage.perServiceBaseCity, serviceId, cityId);

  return {
    coverage,
    combo: (serviceId: number, city: Pick<City, "id">) =>
      basedCount(serviceId, city.id) >= MIN_LOCAL_BUSINESSES,
    comboCount,
    basedCount,
    service: (serviceId: number) => (coverage.perService[serviceId] ?? 0) > 0,
    city: (city: Pick<City, "id">) =>
      (related.get(city.id) ?? [city.id]).some(
        (id) => (coverage.perCity[id] ?? 0) > 0,
      ),
  };
}
