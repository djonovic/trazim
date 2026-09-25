"use client";

import { ArrowLeft, MapPin, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localeKey } from "@/lib/i18n-fields";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export type SearchOption = { slug: string; name: string; hint?: string };

type Step = "service" | "city";

const SearchContext = createContext<{ open: (service?: SearchOption) => void }>(
  {
    open: () => {},
  },
);

export const useSearch = () => use(SearchContext);

const CITY_KEY = "trazim.city";

function readRememberedCity(): SearchOption | null {
  try {
    const raw = localStorage.getItem(CITY_KEY);
    return raw ? (JSON.parse(raw) as SearchOption) : null;
  } catch {
    return null;
  }
}

function rememberCity(city: SearchOption) {
  try {
    localStorage.setItem(CITY_KEY, JSON.stringify(city));
  } catch {
    // Private mode or blocked storage: remembering the city is optional.
  }
}

export function SearchProvider({
  children,
  popularServices,
  popularCities,
}: {
  children: ReactNode;
  popularServices: SearchOption[];
  popularCities: SearchOption[];
}) {
  const [isOpen, setOpen] = useState(false);
  const [initialService, setInitialService] = useState<SearchOption | null>(
    null,
  );

  const open = useCallback((service?: SearchOption) => {
    setInitialService(service ?? null);
    setOpen(true);
  }, []);

  return (
    <SearchContext value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-0 max-w-none translate-y-0 gap-0 rounded-none p-0 sm:top-[12%] sm:max-w-lg sm:rounded-2xl"
        >
          {isOpen && (
            <SearchFlow
              initialService={initialService}
              popularServices={popularServices}
              popularCities={popularCities}
              onDone={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </SearchContext>
  );
}

/**
 * Results are tagged with the step and query they answer: results from the
 * other step are never shown, and while a newer query is still loading the
 * previous ones stay visible but are marked stale so Enter can't pick them.
 */
function useRemoteSearch(
  kind: Step,
  query: string,
  locale: Locale,
  onResults: (kind: Step, query: string, items: SearchOption[]) => void,
) {
  const [state, setState] = useState<{
    kind: Step;
    query: string;
    items: SearchOption[];
  } | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const onResultsRef = useRef(onResults);
  useEffect(() => {
    onResultsRef.current = onResults;
  });

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const key = localeKey[locale];
      if (kind === "service") {
        const { data } = await supabase.rpc("search_services", {
          q,
          max_results: 8,
        });
        if (cancelled) return;
        const items = (data ?? []).map((s) => ({
          slug: s[`slug_${key}`],
          name: s[`name_${key}`],
        }));
        setState({ kind, query: q, items });
        onResultsRef.current(kind, q, items);
      } else {
        const { data } = await supabase.rpc("search_cities", {
          q,
          max_results: 8,
        });
        if (cancelled) return;
        const items = (data ?? []).map((c) => ({
          slug: c.slug,
          name: c[`name_${key}`],
        }));
        setState({ kind, query: q, items });
        onResultsRef.current(kind, q, items);
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [kind, query, locale, supabase]);

  const q = query.trim();
  if (q.length < 2 || !state || state.kind !== kind)
    return { results: null, fresh: q.length < 2 };
  return { results: state.items, fresh: state.query === q };
}

function SearchFlow({
  initialService,
  popularServices,
  popularCities,
  onDone,
}: {
  initialService: SearchOption | null;
  popularServices: SearchOption[];
  popularCities: SearchOption[];
  onDone: () => void;
}) {
  const t = useTranslations("Search");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialService ? "city" : "service");
  const [service, setService] = useState<SearchOption | null>(initialService);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Enter pressed while the results for this query were still loading:
  // pick the first one when they arrive.
  const pendingEnter = useRef<string | null>(null);
  const { results, fresh } = useRemoteSearch(
    step,
    query,
    locale,
    (kind, q, items) => {
      if (pendingEnter.current !== `${kind}:${q}`) return;
      pendingEnter.current = null;
      if (!items[0]) return;
      if (kind === "service") pickService(items[0]);
      else pickCity(items[0]);
    },
  );

  const remembered = useMemo(
    () => (step === "city" ? readRememberedCity() : null),
    [step],
  );
  const suggestions = step === "service" ? popularServices : popularCities;
  const cityOptions =
    remembered && !suggestions.some((c) => c.slug === remembered.slug)
      ? [remembered, ...suggestions]
      : suggestions;
  const options = results ?? (step === "service" ? suggestions : cityOptions);

  useEffect(() => inputRef.current?.focus(), [step]);

  function pickService(option: SearchOption) {
    setService(option);
    setQuery("");
    setStep("city");
  }

  function pickCity(option: SearchOption | null) {
    if (!service) return;
    onDone();
    if (!option) {
      router.push({
        pathname: "/usluge/[service]",
        params: { service: service.slug },
      });
      return;
    }
    rememberCity(option);
    router.push({
      pathname: "/[slug]",
      params: { slug: `${service.slug}-${option.slug}` },
    });
  }

  const pick = (option: SearchOption) =>
    step === "service" ? pickService(option) : pickCity(option);

  return (
    <div className="flex max-h-[100dvh] flex-col sm:max-h-[70vh]">
      <div className="flex items-center gap-2 border-b p-3">
        {step === "city" ? (
          <button
            type="button"
            onClick={() => {
              setStep("service");
              setQuery("");
            }}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label={t("back")}
          >
            <ArrowLeft className="size-5" />
          </button>
        ) : (
          <Search
            className="mx-2 size-5 shrink-0 text-muted-foreground"
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <DialogTitle className="text-xs font-medium text-muted-foreground">
            {step === "service" ? t("serviceStep") : t("cityStep")}
            {step === "city" && service && (
              <span className="text-foreground"> · {service.name}</span>
            )}
          </DialogTitle>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (fresh) {
                if (options[0]) pick(options[0]);
              } else pendingEnter.current = `${step}:${query.trim()}`;
            }}
            placeholder={
              step === "service"
                ? t("servicePlaceholder")
                : t("cityPlaceholder")
            }
            className="w-full bg-transparent text-base outline-none"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg p-2 hover:bg-muted"
          aria-label={tc("close")}
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="overflow-y-auto p-2">
        {!results && (
          <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {step === "service" ? t("popularServices") : t("popularCities")}
          </p>
        )}
        {results && fresh && results.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t("noResults", { query })}
          </p>
        )}
        <ul>
          {step === "city" && !results && (
            <li>
              <OptionButton onClick={() => pickCity(null)} icon="map">
                {t("anyCity")}
              </OptionButton>
            </li>
          )}
          {options.map((option) => (
            <li key={option.slug}>
              <OptionButton
                onClick={() => pick(option)}
                icon={step === "city" ? "pin" : "search"}
              >
                {option.name}
              </OptionButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function OptionButton({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick: () => void;
  icon: "pin" | "search" | "map";
}) {
  const Icon = icon === "search" ? Search : MapPin;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[15px] outline-none hover:bg-muted focus-visible:bg-muted",
        icon === "map" && "font-medium",
      )}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      {children}
    </button>
  );
}

/** Button that opens the search dialog (header pill or hero search bar). */
export function SearchTrigger({
  label,
  variant = "pill",
  className,
}: {
  label: string;
  variant?: "pill" | "hero";
  className?: string;
}) {
  const { open } = useSearch();
  return (
    <button
      type="button"
      onClick={() => open()}
      className={cn(
        "flex items-center gap-2 border bg-white text-left text-muted-foreground transition-colors hover:border-primary/40",
        variant === "pill" && "h-10 rounded-full px-4 text-sm",
        variant === "hero" &&
          "h-14 w-full rounded-2xl px-5 text-base shadow-sm",
        className,
      )}
    >
      <Search
        className={variant === "hero" ? "size-5 text-primary" : "size-4"}
        aria-hidden
      />
      <span className="truncate">{label}</span>
    </button>
  );
}
