import type { BusinessCard as Card } from "@/lib/queries/businesses";
import { BusinessCard } from "./business-card";

export function BusinessGrid({
  businesses,
  cityNames,
  serviceNames,
  sponsored = false,
}: {
  businesses: Card[];
  cityNames: Record<number, string>;
  serviceNames: Record<number, string>;
  sponsored?: boolean;
}) {
  return (
    <ul
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      {...(sponsored ? { "data-nosnippet": "" } : {})}
    >
      {businesses.map((b) => (
        <li key={b.id} className="flex [&>a]:w-full">
          <BusinessCard
            business={b}
            cityName={cityNames[b.cityId] ?? ""}
            serviceNames={b.serviceIds
              .map((id) => serviceNames[id])
              .filter(Boolean)}
            sponsored={sponsored}
          />
        </li>
      ))}
    </ul>
  );
}
