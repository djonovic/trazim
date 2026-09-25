"use client";

import { MapPin, Search, Sparkles, X } from "lucide-react";
import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type SearchService = {
  slug: string;
  name: string;
  group: string;
  search: string;
  /** Folded names in every language (exact match without picking). */
  names: string[];
  popular: number;
};
export type SearchCity = {
  slug: string;
  name: string;
  parent: string | null;
  search: string;
  names: string[];
  popular: number;
};

type Labels = Record<
  | "label"
  | "what"
  | "whatPlaceholder"
  | "where"
  | "wherePlaceholder"
  | "whole"
  | "allCategories"
  | "popularServices"
  | "popularCities"
  | "services"
  | "cities"
  | "searchFor"
  | "noCity"
  | "clear"
  | "submit",
  string
>;

type Option = {
  key: string;
  label: ReactNode;
  hint?: string;
  icon?: ReactNode;
  pick: () => void;
};

const fold = (s: string) =>
  s
    .replace(/đ/g, "dj")
    .replace(/Đ/g, "Dj")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/** Popular first (in the hand-picked order), then alphabetical. */
const byPopular = <T extends { popular: number; name: string }>(a: T, b: T) =>
  (a.popular < 0 ? 999 : a.popular) - (b.popular < 0 ? 999 : b.popular) ||
  a.name.localeCompare(b.name);

function match<T extends { search: string; name: string; popular: number }>(
  items: T[],
  text: string,
  limit: number,
) {
  const q = fold(text);
  if (!q)
    return [...items]
      .filter((i) => i.popular >= 0)
      .sort(byPopular)
      .slice(0, limit);
  const words = q.split(/\s+/);
  return items
    .filter((i) => words.every((w) => i.search.includes(w)))
    .sort(
      (a, b) =>
        Number(fold(b.name).startsWith(q)) -
          Number(fold(a.name).startsWith(q)) || byPopular(a, b),
    )
    .slice(0, limit);
}

/** Text input with a suggestion list (ARIA combobox, arrows/Enter/Esc). */
function Combo({
  label,
  placeholder,
  icon,
  value,
  onChange,
  options,
  heading,
  empty,
  name,
  clearLabel,
  onEnter,
  inputRef,
}: {
  label: string;
  placeholder: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  heading?: string;
  empty?: string;
  name: string;
  clearLabel: string;
  /** Enter with nothing highlighted. */
  onEnter?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const show = open && (options.length > 0 || Boolean(empty));

  return (
    <div className="relative min-w-0">
      <label htmlFor={`${id}-input`} className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      <input
        ref={inputRef}
        id={`${id}-input`}
        name={name}
        type="search"
        autoComplete="off"
        enterKeyHint="search"
        role="combobox"
        aria-expanded={show}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((a) => Math.min(a + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, -1));
          } else if (e.key === "Escape") {
            setOpen(false);
          } else if (e.key === "Enter") {
            if (show && active >= 0 && options[active]) {
              e.preventDefault();
              options[active].pick();
              setOpen(false);
              setActive(-1);
            } else if (onEnter) {
              e.preventDefault();
              setOpen(false);
              onEnter();
            }
          }
        }}
        className="h-12 w-full min-w-0 rounded-xl border bg-white pr-9 pl-10 text-[15px] outline-none placeholder:text-muted-foreground/80 focus:border-primary [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label={clearLabel}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onChange("");
            setOpen(true);
            inputRef?.current?.focus();
          }}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      )}
      {show && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-full z-40 mt-1.5 max-h-80 overflow-auto rounded-2xl border bg-white p-1.5 shadow-xl"
        >
          {heading && (
            <li
              role="presentation"
              className="px-3 pt-1.5 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              {heading}
            </li>
          )}
          {options.map((o, i) => (
            <li
              key={o.key}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => {
                o.pick();
                setOpen(false);
                setActive(-1);
              }}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px]",
                i === active && "bg-secondary",
              )}
            >
              {o.icon && (
                <span className="shrink-0 text-muted-foreground">{o.icon}</span>
              )}
              <span className="min-w-0 flex-1 truncate">{o.label}</span>
              {o.hint && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {o.hint}
                </span>
              )}
            </li>
          ))}
          {!options.length && empty && (
            <li
              role="presentation"
              className="px-3 py-2.5 text-sm text-muted-foreground"
            >
              {empty}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export function SearchBarForm({
  action,
  services,
  cities,
  categories,
  defaults,
  labels,
  className,
}: {
  action: string;
  services: SearchService[];
  cities: SearchCity[];
  categories: { slug: string; name: string }[];
  defaults: { q?: string; grad?: string; kategorija?: string };
  labels: Labels;
  className?: string;
}) {
  const router = useRouter();
  const initialCity = cities.find((c) => c.slug === defaults.grad);
  const [what, setWhat] = useState(defaults.q ?? "");
  const [service, setService] = useState<SearchService | null>(null);
  const [where, setWhere] = useState(initialCity?.name ?? "");
  const [city, setCity] = useState<SearchCity | null>(initialCity ?? null);
  const [category, setCategory] = useState(defaults.kategorija ?? "");
  const whereRef = useRef<HTMLInputElement>(null);
  const whatRef = useRef<HTMLInputElement>(null);

  const serviceHits = useMemo(() => match(services, what, 8), [services, what]);
  const cityHits = useMemo(() => match(cities, where, 8), [cities, where]);

  // Typed without picking: an exact name in any language still counts.
  const exact = (text: string) => fold(text).replace(/-/g, " ");
  const resolveService = () =>
    service ?? services.find((s) => s.names.includes(exact(what))) ?? null;
  const resolveCity = () =>
    city ?? cities.find((c) => c.names.includes(exact(where))) ?? null;

  function go(
    overrides: {
      service?: SearchService | null;
      city?: SearchCity | null;
    } = {},
  ) {
    const s =
      overrides.service !== undefined ? overrides.service : resolveService();
    const c = overrides.city !== undefined ? overrides.city : resolveCity();
    // A known service: straight to its listing (town) or service page.
    if (s && !category) {
      if (c)
        router.push({
          pathname: "/[slug]",
          params: { slug: `${s.slug}-${c.slug}` },
        });
      else
        router.push({
          pathname: "/usluge/[service]",
          params: { service: s.slug },
        });
      return;
    }
    const query: Record<string, string> = {};
    if (what.trim()) query.q = what.trim();
    if (c) query.grad = c.slug;
    else if (where.trim()) query.grad = where.trim();
    if (category) query.kategorija = category;
    router.push({ pathname: "/pretraga", query });
  }

  const serviceOptions: Option[] = [
    ...serviceHits.map((s) => ({
      key: s.slug,
      label: s.name,
      hint: s.group,
      icon: <Search className="size-4" />,
      pick: () => {
        setWhat(s.name);
        setService(s);
        // Next step: the town (or search right away if one is set).
        if (city || where.trim()) go({ service: s });
        else setTimeout(() => whereRef.current?.focus(), 0);
      },
    })),
    ...(fold(what).length >= 2 && !service
      ? [
          {
            key: "__search__",
            label: labels.searchFor.replace("__Q__", what.trim()),
            icon: <Sparkles className="size-4" />,
            pick: () => go({ service: null }),
          },
        ]
      : []),
  ];

  const cityOptions: Option[] = [
    ...(fold(where)
      ? []
      : [
          {
            key: "__whole__",
            label: labels.whole,
            icon: <MapPin className="size-4" />,
            pick: () => {
              setWhere("");
              setCity(null);
            },
          },
        ]),
    ...cityHits.map((c) => ({
      key: c.slug,
      label: c.name,
      hint: c.parent ?? undefined,
      icon: <MapPin className="size-4" />,
      pick: () => {
        setWhere(c.name);
        setCity(c);
      },
    })),
  ];

  return (
    <form
      action={action}
      method="get"
      role="search"
      aria-label={labels.label}
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className={cn(
        "grid gap-2 rounded-2xl border bg-white/95 p-2.5 shadow-lg shadow-primary/5 sm:grid-cols-2 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto]",
        className,
      )}
    >
      <div className="sm:col-span-2 md:col-span-1">
        <Combo
          name="q"
          label={labels.what}
          placeholder={labels.whatPlaceholder}
          icon={<Search className="size-4" />}
          value={what}
          onChange={(v) => {
            setWhat(v);
            setService(null);
          }}
          options={serviceOptions}
          heading={fold(what) ? labels.services : labels.popularServices}
          clearLabel={labels.clear}
          onEnter={() => go()}
          inputRef={whatRef}
        />
      </div>
      <Combo
        name="grad"
        label={labels.where}
        placeholder={labels.wherePlaceholder}
        icon={<MapPin className="size-4" />}
        value={where}
        onChange={(v) => {
          setWhere(v);
          setCity(null);
        }}
        options={cityOptions}
        heading={fold(where) ? labels.cities : labels.popularCities}
        empty={labels.noCity}
        clearLabel={labels.clear}
        onEnter={() => go()}
        inputRef={whereRef}
      />
      <select
        name="kategorija"
        value={category}
        aria-label={labels.allCategories}
        onChange={(e) => setCategory(e.target.value)}
        className="h-12 w-full min-w-0 rounded-xl border bg-white px-3.5 text-[15px] outline-none focus:border-primary"
      >
        <option value="">{labels.allCategories}</option>
        {categories.map((g) => (
          <option key={g.slug} value={g.slug}>
            {g.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-semibold text-primary-foreground hover:bg-primary/90 sm:col-span-2 md:col-span-1"
      >
        <Search className="size-4" aria-hidden />
        {labels.submit}
      </button>
    </form>
  );
}
