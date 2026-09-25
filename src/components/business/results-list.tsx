"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState, useSyncExternalStore } from "react";
import { isOpenNow } from "@/lib/format";
import type { BusinessCard as Card } from "@/lib/queries/businesses";
import { cn } from "@/lib/utils";
import { BusinessCard } from "./business-card";

export type Filter = "rating" | "verified" | "openNow" | "online" | "emergency";
type Sort = "recommended" | "rating" | "reviews";

const FILTERS = [
  { key: "rating", label: "filterRating" },
  { key: "verified", label: "filterVerified" },
  { key: "openNow", label: "filterOpenNow" },
  { key: "online", label: "filterOnline" },
  { key: "emergency", label: "filterEmergency" },
] as const satisfies { key: Filter; label: string }[];

const subscribe = () => () => {};

export function ResultsList({
  businesses,
  cityNames,
  serviceNames,
  page,
  pageSize,
  pageHrefs,
  initialFilters = [],
}: {
  businesses: Card[];
  cityNames: Record<number, string>;
  serviceNames: Record<number, string>;
  page: number;
  pageSize: number;
  /** Server-computed URLs for pages 1..n (index 0 = page 1). */
  pageHrefs: string[];
  /** Filters switched on from the start (e.g. "Radi sada" from the search bar). */
  initialFilters?: Filter[];
}) {
  const t = useTranslations("Listing");
  const tc = useTranslations("Common");
  const [filters, setFilters] = useState<Set<Filter>>(
    () => new Set(initialFilters),
  );
  const [sort, setSort] = useState<Sort>("recommended");
  // "Open now" depends on the visitor's clock; skip it during SSR.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const active = filters.size > 0 || sort !== "recommended";

  const visible = useMemo(() => {
    let list = businesses.filter((b) => {
      if (filters.has("rating") && !(b.ratingCount > 0 && b.rating >= 4))
        return false;
      if (filters.has("verified") && !b.verified) return false;
      if (filters.has("online") && !b.online) return false;
      if (filters.has("emergency") && !b.emergency) return false;
      if (
        filters.has("openNow") &&
        hydrated &&
        !isOpenNow(b.hours, b.emergency)
      )
        return false;
      return true;
    });
    if (sort === "rating")
      list = [...list].sort(
        (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
      );
    if (sort === "reviews")
      list = [...list].sort((a, b) => b.ratingCount - a.ratingCount);
    // With filters/sort on, show everything on one page; otherwise the static page slice.
    return active ? list : list.slice((page - 1) * pageSize, page * pageSize);
  }, [businesses, filters, sort, hydrated, active, page, pageSize]);

  const toggle = (key: Filter) =>
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="space-y-4">
      {businesses.length > 1 && (
        <div
          className="flex flex-wrap items-center gap-2"
          role="toolbar"
          aria-label={t("filters")}
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filters.has(f.key)}
              onClick={() => toggle(f.key)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-sm font-medium transition-colors",
                filters.has(f.key)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-white hover:border-primary/40",
              )}
            >
              {t(f.label)}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("sort")}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-9 rounded-full border bg-white px-3 text-sm font-medium"
            >
              <option value="recommended">{t("sortRecommended")}</option>
              <option value="rating">{t("sortRating")}</option>
              <option value="reviews">{t("sortReviews")}</option>
            </select>
          </label>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t("noMatches")}{" "}
          <button
            type="button"
            className="font-semibold text-primary underline-offset-4 hover:underline"
            onClick={() => {
              setFilters(new Set());
              setSort("recommended");
            }}
          >
            {t("clearFilters")}
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((b, i) => (
            <li key={b.id} className="flex">
              <div className="flex w-full [&>a]:w-full">
                <BusinessCard
                  business={b}
                  cityName={cityNames[b.cityId] ?? ""}
                  serviceNames={b.serviceIds
                    .map((id) => serviceNames[id])
                    .filter(Boolean)}
                  priority={i < 3}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!active && pageHrefs.length > 1 && (
        <nav
          className="flex items-center justify-center gap-1 pt-4"
          aria-label="Pagination"
        >
          {page > 1 && (
            <a
              href={pageHrefs[page - 2]}
              rel="prev"
              className="flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium hover:bg-muted"
            >
              <ChevronLeft className="size-4" aria-hidden />
              {tc("previous")}
            </a>
          )}
          {pageHrefs.map((href, i) => (
            <a
              key={href}
              href={href}
              aria-current={i + 1 === page ? "page" : undefined}
              className={cn(
                "flex size-10 items-center justify-center rounded-full text-sm font-semibold",
                i + 1 === page
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {i + 1}
            </a>
          ))}
          {page < pageHrefs.length && (
            <a
              href={pageHrefs[page]}
              rel="next"
              className="flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium hover:bg-muted"
            >
              {tc("next")}
              <ChevronRight className="size-4" aria-hidden />
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
