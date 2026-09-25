import { getAllPriceStats } from "@/lib/queries/prices";
import { getTaxonomy } from "@/lib/queries/taxonomy";

// Open price data per service (/data/cijene/vodoinstalater.csv): country and
// city rows, per unit. Linked from the price guides and their Dataset markup,
// so journalists and AI engines can cite exact numbers.
export const revalidate = 21600;

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const slug = file.replace(/\.csv$/, "");
  const { services, cities } = await getTaxonomy();
  const service = services.find((s) => s.slug_me === slug);
  if (!service || !file.endsWith(".csv"))
    return new Response("Not found", { status: 404 });

  const rows = (await getAllPriceStats())
    .filter((s) => s.service_id === service.id)
    .sort(
      (a, b) =>
        (a.city_key ?? 0) - (b.city_key ?? 0) ||
        (b.items_count ?? 0) - (a.items_count ?? 0),
    );
  const header = [
    "service",
    "city",
    "unit",
    "currency",
    "average",
    "median",
    "p25",
    "p75",
    "min",
    "max",
    "price_items",
    "businesses",
    "computed_at",
    "source",
  ];
  const lines = rows.map((r) =>
    [
      service.name_me,
      r.city_key
        ? (cities.find((c) => c.id === r.city_key)?.name_me ?? "")
        : "Crna Gora",
      r.unit,
      "EUR",
      r.price_avg,
      r.price_median,
      r.price_p25,
      r.price_p75,
      r.price_min,
      r.price_max,
      r.items_count,
      r.businesses_count,
      r.computed_at,
      "https://trazim.me",
    ]
      .map(csvCell)
      .join(","),
  );
  return new Response([header.join(","), ...lines].join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `inline; filename="trazim-cijene-${slug}.csv"`,
    },
  });
}
