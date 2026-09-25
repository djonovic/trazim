import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TZ = { timeZone: "Europe/Podgorica" } as const;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("sr-Latn-ME", TZ);
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("sr-Latn-ME", {
    ...TZ,
    dateStyle: "short",
    timeStyle: "short",
  });

const TONES = {
  neutral: "bg-muted text-muted-foreground",
  good: "bg-secondary text-primary",
  warn: "bg-amber-100 text-amber-900",
  bad: "bg-destructive/10 text-destructive",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

export function FilterTabs<T extends string>({
  pathname,
  current,
  options,
  query = {},
}: {
  pathname: "/admin/profili" | "/admin/recenzije" | "/admin/prijave";
  current: T;
  options: { value: T; label: string; count?: number }[];
  query?: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Link
          key={o.value}
          href={{ pathname, query: { ...query, filter: o.value } }}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-medium",
            current === o.value
              ? "border-primary bg-secondary text-primary"
              : "bg-white hover:bg-muted",
          )}
        >
          {o.label}
          {o.count != null && (
            <span className="text-xs tabular-nums opacity-70">{o.count}</span>
          )}
        </Link>
      ))}
    </div>
  );
}

export function Pager({
  pathname,
  page,
  pages,
  query,
}: {
  pathname: "/admin/profili" | "/admin/recenzije";
  page: number;
  pages: number;
  query: Record<string, string>;
}) {
  if (pages <= 1) return null;
  const link = (p: number, label: string) => (
    <Link
      href={{ pathname, query: { ...query, page: String(p) } }}
      className="inline-flex h-9 items-center rounded-full border bg-white px-4 text-sm font-medium hover:bg-muted"
    >
      {label}
    </Link>
  );
  return (
    <div className="flex items-center justify-center gap-3 text-sm">
      {page > 1 && link(page - 1, "← Prethodna")}
      <span className="text-muted-foreground tabular-nums">
        {page} / {pages}
      </span>
      {page < pages && link(page + 1, "Sljedeća →")}
    </div>
  );
}

export const REPORT_REASONS: Record<string, string> = {
  inappropriate: "Neprikladan sadržaj",
  abusive: "Uvrede ili prijetnje",
  false_info: "Netačni podaci",
  spam: "Spam ili reklama",
  other: "Nešto drugo",
};

export const SCOPES: Record<string, string> = {
  home: "Početna",
  service: "Usluga (svi gradovi)",
  city: "Grad (sve usluge)",
  service_city: "Usluga + grad",
};

/** Where each sponsorship scope is shown on the site. */
export const SCOPE_HINTS: Record<string, string> = {
  home: "Blok „Sponzorisano” na početnoj stranici (najviše 4 biznisa).",
  service:
    "Stranica usluge (npr. /usluge/vodoinstalater) i vrh liste te usluge u svakom gradu.",
  city: "Stranica grada (npr. /gradovi/budva).",
  service_city:
    "Vrh liste za tu uslugu u tom gradu (npr. /vodoinstalater-budva), a ispod njih i na stranici grada i stranici usluge.",
};

export const ACTIONS: Record<string, string> = {
  "business.approve": "Odobren profil",
  "business.verify": "Označen kao provjeren",
  "business.unverify": "Skinuta oznaka provjeren",
  "business.reject": "Odbijen profil",
  "business.suspend": "Suspendovan profil",
  "business.restore": "Vraćen profil",
  "review.hidden": "Sakrivena recenzija",
  "review.removed": "Uklonjena recenzija",
  "review.restore": "Vraćena recenzija",
  "report.resolved": "Prijava riješena",
  "report.dismissed": "Prijava odbačena",
  "sponsorship.create": "Dodato sponzorstvo",
  "inquiry.reject": "Odbijen upit",
  "banner.create": "Dodat baner",
  "banner.active": "Baner aktiviran",
  "banner.paused": "Baner pauziran",
  "banner.cancelled": "Baner otkazan",
  "inquiry.restore": "Vraćen upit",
  "sponsorship.active": "Sponzorstvo aktivirano",
  "sponsorship.paused": "Sponzorstvo pauzirano",
  "sponsorship.cancelled": "Sponzorstvo otkazano",
};

export function StatusBadges({
  status,
  moderatedAt,
  verifiedAt,
}: {
  status: string;
  moderatedAt: string | null;
  verifiedAt: string | null;
}) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {status === "rejected" && <Badge tone="bad">Odbijen</Badge>}
      {status === "suspended" && <Badge tone="bad">Suspendovan</Badge>}
      {status === "active" && !moderatedAt && (
        <Badge tone="warn">Na provjeri</Badge>
      )}
      {status === "active" && moderatedAt && <Badge>Aktivan</Badge>}
      {verifiedAt && <Badge tone="good">Provjeren</Badge>}
    </span>
  );
}
