"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  createSponsorships,
  searchBusinessesForAdmin,
  type SponsorshipInput,
} from "@/app/actions/admin";
import { useRouter } from "@/i18n/navigation";
import { SPONSOR_PRICES, SPONSOR_SLOTS, SPONSOR_YEAR_MONTHS } from "@/lib/site";
import { SCOPE_HINTS, SCOPES } from "./ui";

type Option = { id: number; name: string };
type Business = Awaited<ReturnType<typeof searchBusinessesForAdmin>>[number];
type Placement = SponsorshipInput["placements"][number] & { key: number };

const ERRORS: Record<string, string> = {
  business: "Izaberi biznis.",
  placements: "Dodaj bar jednu poziciju.",
  dates: "Kraj ne može biti prije početka.",
  service: "Izaberi uslugu za svaku poziciju koja je traži.",
  city: "Izaberi grad za svaku poziciju koja ga traži.",
  auth: "Nemaš admin pristup.",
};

const day = (offset = 0) =>
  new Date(Date.now() + offset * 86400_000).toLocaleDateString("sv-SE", {
    timeZone: "Europe/Podgorica",
  });

const field =
  "h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-primary";

const needsService = (scope: Placement["scope"]) =>
  scope === "service" || scope === "service_city";
const needsCity = (scope: Placement["scope"]) =>
  scope === "city" || scope === "service_city";

/** 1 pozicija, 2–4 pozicije, 5+ pozicija (11–14 pozicija). */
const pozicija = (n: number) =>
  n % 10 === 1 && n % 100 !== 11
    ? "pozicija"
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
      ? "pozicije"
      : "pozicija";

let nextKey = 1;
const newPlacement = (
  scope: Placement["scope"] = "service_city",
): Placement => ({
  key: nextKey++,
  scope,
  serviceId: null,
  cityId: null,
});

/**
 * One business and period, any number of placements: each "+ Dodaj poziciju"
 * row is home, a service, a city or a service + city.
 */
export function SponsorshipForm({
  services,
  cities,
}: {
  services: Option[];
  cities: Option[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Business[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [placements, setPlacements] = useState<Placement[]>(() => [
    newPlacement(),
  ]);
  const [startsAt, setStartsAt] = useState(day());
  const [endsAt, setEndsAt] = useState(day(30));
  const [paymentRef, setPaymentRef] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (business || query.trim().length < 2) return;
    const timer = setTimeout(
      () => searchBusinessesForAdmin(query).then(setResults),
      250,
    );
    return () => clearTimeout(timer);
  }, [query, business]);

  // Price list from /za-biznise: the home page, or any other placement.
  const priceFor = (p: Placement) =>
    p.scope === "home" ? SPONSOR_PRICES.home : SPONSOR_PRICES.other;

  const update = (key: number, patch: Partial<Placement>) =>
    setPlacements((list) =>
      list.map((p) => (p.key === key ? { ...p, ...patch } : p)),
    );

  function submit() {
    startTransition(async () => {
      const res = await createSponsorships({
        businessId: business?.id ?? "",
        placements: placements.map((p) => ({
          scope: p.scope,
          serviceId: needsService(p.scope) ? p.serviceId : null,
          cityId: needsCity(p.scope) ? p.cityId : null,
        })),
        startsAt,
        endsAt,
        paymentRef,
      });
      if (!res.ok) {
        const [code, scope, serviceId, cityId] = res.error.split(":");
        const where = [
          SCOPES[scope],
          services.find((s) => s.id === Number(serviceId))?.name,
          cities.find((c) => c.id === Number(cityId))?.name,
        ]
          .filter(Boolean)
          .join(" · ");
        setMessage({
          ok: false,
          text:
            code === "full"
              ? `Popunjeno u tom periodu (${scope === "home" ? SPONSOR_SLOTS.home : SPONSOR_SLOTS.page} mjesta): ${where}. Upiši ga na listu čekanja.`
              : (ERRORS[res.error] ?? "Nije uspjelo. Pokušaj ponovo."),
        });
        return;
      }
      setMessage({
        ok: true,
        text: `Dodato: ${business?.name} (${res.count} ${pozicija(res.count ?? 0)})`,
      });
      setBusiness(null);
      setQuery("");
      setPaymentRef("");
      setPlacements([newPlacement()]);
      router.refresh();
    });
  }

  return (
    <form
      className="space-y-5 rounded-2xl border bg-white p-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <h2 className="font-bold">Novo sponzorstvo</h2>

      <div className="relative space-y-1.5">
        <label className="text-sm font-medium" htmlFor="sp-business">
          Biznis
        </label>
        {business ? (
          <p className="flex h-10 items-center justify-between rounded-xl border bg-secondary px-3 text-sm">
            <span className="font-medium">{business.name}</span>
            <button
              type="button"
              onClick={() => setBusiness(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Promijeni
            </button>
          </p>
        ) : (
          <>
            <input
              id="sp-business"
              className={field}
              value={query}
              placeholder="Počni da kucaš naziv…"
              autoComplete="off"
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim().length < 2) setResults([]);
              }}
            />
            {results.length > 0 && (
              <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-64 overflow-auto rounded-xl border bg-white p-1 shadow-lg">
                {results.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setBusiness(b);
                        setResults([]);
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      {b.name}{" "}
                      <span className="text-muted-foreground">/{b.slug}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-1.5 text-sm font-medium">
          Pozicije ({placements.length})
        </legend>
        <ol className="space-y-2">
          {placements.map((p, i) => (
            <li
              key={p.key}
              data-placement
              className="space-y-2 rounded-xl border bg-muted/30 p-3"
            >
              <div className="flex items-start gap-2">
                <span className="mt-2.5 w-5 shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">
                  {i + 1}.
                </span>
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-3">
                  <select
                    aria-label="Gdje se prikazuje"
                    className={field}
                    value={p.scope}
                    onChange={(e) =>
                      update(p.key, {
                        scope: e.target.value as Placement["scope"],
                      })
                    }
                  >
                    {Object.entries(SCOPES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {needsService(p.scope) && (
                    <select
                      aria-label="Usluga"
                      className={field}
                      value={p.serviceId ?? ""}
                      onChange={(e) =>
                        update(p.key, {
                          serviceId: Number(e.target.value) || null,
                        })
                      }
                    >
                      <option value="">Usluga…</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {needsCity(p.scope) && (
                    <select
                      aria-label="Grad"
                      className={field}
                      value={p.cityId ?? ""}
                      onChange={(e) =>
                        update(p.key, {
                          cityId: Number(e.target.value) || null,
                        })
                      }
                    >
                      <option value="">Grad…</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {placements.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPlacements((list) =>
                        list.filter((x) => x.key !== p.key),
                      )
                    }
                    className="mt-1 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Ukloni poziciju ${i + 1}`}
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <p className="pl-7 text-xs text-muted-foreground">
                {SCOPE_HINTS[p.scope]}
                {" · "}
                <span className="font-semibold text-foreground">
                  {priceFor(p)} €/mj, {priceFor(p) * SPONSOR_YEAR_MONTHS} €
                  godišnje
                </span>
              </p>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setPlacements((list) => [...list, newPlacement()])}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-4 text-sm font-semibold hover:bg-muted"
          >
            <Plus className="size-4" aria-hidden />
            Dodaj poziciju
          </button>
          {!placements.some((p) => p.scope === "home") && (
            <button
              type="button"
              onClick={() =>
                setPlacements((list) => [...list, newPlacement("home")])
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-4 text-sm font-semibold hover:bg-muted"
            >
              <Plus className="size-4" aria-hidden />
              Početna
            </button>
          )}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Od</span>
          <input
            type="date"
            className={field}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Do (uključujući)</span>
          <input
            type="date"
            className={field}
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Plaćanje (napomena)</span>
          <input
            className={field}
            value={paymentRef}
            maxLength={200}
            placeholder="Npr. uplata na račun 12.10."
            onChange={(e) => setPaymentRef(e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Dodaj sponzorstvo
          {placements.length > 1 &&
            ` (${placements.length} ${pozicija(placements.length)})`}
        </button>
        {message && (
          <span
            role={message.ok ? "status" : "alert"}
            className={
              message.ok ? "text-sm text-primary" : "text-sm text-destructive"
            }
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
