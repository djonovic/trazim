import "server-only";
import { unstable_cache } from "next/cache";
import type { Tables } from "@/lib/supabase/database.types";
import { dbError } from "@/lib/supabase/errors";
import { publicDb } from "@/lib/supabase/public";

export type PriceStat = Tables<"price_stats">;

/** Price stats for a service; cityId 0 = all of Montenegro. Refreshed nightly by pg_cron. */
export const getPriceStats = unstable_cache(
  async (serviceId: number) => {
    const { data, error } = await publicDb
      .from("price_stats")
      .select("*")
      .eq("service_id", serviceId);
    if (error) throw dbError(error, "getPriceStats");
    return data;
  },
  ["price-stats-v1"],
  { tags: ["prices"], revalidate: 21600 },
);

/** The most common unit's stats for a city (or country when cityId is 0). */
export function pickPriceStat(stats: PriceStat[], cityId: number) {
  return (
    stats
      .filter((s) => s.city_key === cityId)
      .sort((a, b) => (b.items_count ?? 0) - (a.items_count ?? 0))[0] ?? null
  );
}

/** Every price stat row (country + cities), for /cijene and /statistika. */
export const getAllPriceStats = unstable_cache(
  async () => {
    const { data, error } = await publicDb.from("price_stats").select("*");
    if (error) throw dbError(error, "getAllPriceStats");
    return data;
  },
  ["all-price-stats-v1"],
  { tags: ["prices"], revalidate: 21600 },
);

export type PriceRow = {
  name: string;
  unit: Tables<"price_list_items">["unit"];
  avg: number;
  min: number;
  max: number;
  count: number;
};

/**
 * Price table for a service ("Montaža rasvjete 25 €, 20–40 €"), grouped by
 * item name across businesses. cityIds limits it to businesses based there.
 */
export const getPriceTable = unstable_cache(
  async (serviceId: number, cityIds: number[] | null) => {
    let query = publicDb
      .from("price_list_items")
      .select(
        "name, kind, price_from, price_to, unit, businesses!inner(status, city_id)",
      )
      .eq("service_id", serviceId)
      .in("kind", ["fixed", "from", "range"])
      .eq("businesses.status", "active");
    if (cityIds) query = query.in("businesses.city_id", cityIds);
    const { data, error } = await query;
    if (error) throw dbError(error, "getPriceTable");

    const groups = new Map<
      string,
      {
        name: string;
        unit: PriceRow["unit"];
        values: number[];
        lows: number[];
        highs: number[];
      }
    >();
    for (const item of data) {
      const key = `${item.name.trim().toLowerCase()}|${item.unit}`;
      const g = groups.get(key) ?? {
        name: item.name.trim(),
        unit: item.unit,
        values: [],
        lows: [],
        highs: [],
      };
      const from = Number(item.price_from);
      const to = item.price_to == null ? from : Number(item.price_to);
      g.values.push(item.kind === "range" ? (from + to) / 2 : from);
      g.lows.push(from);
      g.highs.push(to);
      groups.set(key, g);
    }
    return [...groups.values()]
      .map((g): PriceRow => ({
        name: g.name,
        unit: g.unit,
        avg:
          Math.round(
            (g.values.reduce((a, b) => a + b, 0) / g.values.length) * 100,
          ) / 100,
        min: Math.min(...g.lows),
        max: Math.max(...g.highs),
        count: g.values.length,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  },
  ["price-table-v1"],
  { tags: ["prices", "businesses"], revalidate: 21600 },
);
