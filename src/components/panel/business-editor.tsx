"use client";

import {
  Check,
  ImagePlus,
  Loader2,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { ViberIcon, WhatsAppIcon } from "@/components/icons/apps";
import { useFormatter, useTranslations } from "next-intl";
import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  addPhotos,
  deletePhoto,
  setCoverPhoto,
  setHours,
  setPriceList,
  setServicesAndCities,
  updateProfile,
} from "@/app/actions/business";
import { revealInquiry } from "@/app/actions/inquiries";
import { replyToReview } from "@/app/actions/reviews";
import { Stars } from "@/components/business/review-list";
import { MessengerField } from "@/components/panel/messenger-field";
import { messengerFromStored } from "@/lib/business-input";
import { useRouter } from "@/i18n/navigation";
import { uploadPhotos } from "@/lib/upload-photos";
import { cn } from "@/lib/utils";

type Tab =
  | "profile"
  | "services"
  | "hours"
  | "prices"
  | "photos"
  | "reviews"
  | "inquiries"
  | "share";
type Unit = "hour" | "m2" | "piece" | "job" | "session" | "day" | "month";
type Kind = "fixed" | "from" | "range" | "on_request" | "free";

export type EditorBusiness = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  phone: string | null;
  viber: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  address: string | null;
  cityId: number;
  online: boolean;
  emergency: boolean;
  languages: string[];
  primaryServiceIds: number[];
  otherServiceIds: number[];
  cityIds: number[];
  hours: { weekday: number; opensAt: string; closesAt: string }[];
  prices: {
    name: string;
    kind: Kind;
    priceFrom: number | null;
    priceTo: number | null;
    unit: Unit;
    serviceId: number | null;
  }[];
  photos: { id: string; url: string; isCover: boolean }[];
  inquiries: {
    id: string;
    service: string;
    city: string;
    body: string;
    urgent: boolean;
    when: string | null;
    createdAt: string;
    direct: boolean;
    revealed: boolean;
  }[];
  reviews: {
    id: string;
    rating: number;
    body: string | null;
    hidden: boolean;
    createdAt: string;
    author: string;
    reply: string | null;
  }[];
};

export type EditorOptions = {
  services: { id: number; name: string; search: string }[];
  cities: { id: number; name: string; parentId: number | null }[];
  weekdays: string[];
  units: Record<Unit, string>;
  languages: { code: string; name: string }[];
};

const input =
  "focus:border-primary h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] outline-none";
const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "dj");

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && (
        <span className="block text-xs text-muted-foreground">{hint}</span>
      )}
    </label>
  );
}

function useSave() {
  const t = useTranslations("Panel");
  const tw = useTranslations("Wizard");
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const run = (action: () => Promise<{ ok: boolean; fields?: string[] }>) =>
    startTransition(async () => {
      const res = await action();
      setState(res.ok ? "saved" : "error");
      const field = res.ok ? null : res.fields?.[0];
      setMessage(
        res.ok
          ? null
          : field &&
              [
                "name",
                "phone",
                "viber",
                "whatsapp",
                "email",
                "services",
              ].includes(field)
            ? tw(`errors.${field}` as "errors.name")
            : tw("errors.generic"),
      );
    });

  const button = (
    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : state === "saved" ? (
          <Check className="size-4" />
        ) : null}
        {pending ? t("saving") : state === "saved" ? t("saved") : t("save")}
      </button>
      {message && (
        <span role="alert" className="text-sm text-destructive">
          {message}
        </span>
      )}
    </div>
  );
  const dirty = () => state !== "idle" && setState("idle");
  return { run, button, dirty };
}

export function BusinessEditor({
  business,
  options,
}: {
  business: EditorBusiness;
  options: EditorOptions;
}) {
  const t = useTranslations("Panel");
  const [tab, setTab] = useState<Tab>("profile");
  const tabs: Tab[] = [
    "profile",
    "services",
    "hours",
    "prices",
    "photos",
    "reviews",
    "inquiries",
    "share",
  ];

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        className="-mx-4 flex gap-1 overflow-x-auto border-b px-4"
      >
        {tabs.map((key) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold whitespace-nowrap",
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`tabs.${key}`)}
            {key === "inquiries" && business.inquiries.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground tabular-nums">
                {business.inquiries.length}
              </span>
            )}
            {key === "reviews" && business.reviews.length > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs tabular-nums">
                {business.reviews.length}
              </span>
            )}
          </button>
        ))}
      </div>
      {tab === "profile" && (
        <ProfileTab business={business} options={options} />
      )}
      {tab === "services" && (
        <ServicesTab business={business} options={options} />
      )}
      {tab === "hours" && <HoursTab business={business} options={options} />}
      {tab === "prices" && <PricesTab business={business} options={options} />}
      {tab === "photos" && <PhotosTab business={business} />}
      {tab === "reviews" && <ReviewsTab business={business} />}
      {tab === "inquiries" && <InquiriesTab business={business} />}
      {tab === "share" && <ShareTab business={business} />}
    </div>
  );
}

function ProfileTab({
  business,
  options,
}: {
  business: EditorBusiness;
  options: EditorOptions;
}) {
  const t = useTranslations("Panel");
  const tw = useTranslations("Wizard");
  const { run, button, dirty } = useSave();
  const [v, setV] = useState({
    name: business.name,
    description: business.description ?? "",
    phone: business.phone ?? "",
    viber: messengerFromStored(business.viber, business.phone),
    whatsapp: messengerFromStored(business.whatsapp, business.phone),
    email: business.email ?? "",
    website: business.website ?? "",
    instagram: business.instagram ?? "",
    address: business.address ?? "",
    online: business.online,
    emergency: business.emergency,
    languages: business.languages,
  });
  const set = (patch: Partial<typeof v>) => {
    setV((x) => ({ ...x, ...patch }));
    dirty();
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        run(() => updateProfile(business.id, v));
      }}
    >
      <Field label={tw("name")}>
        <input
          className={input}
          value={v.name}
          maxLength={80}
          onChange={(e) => set({ name: e.target.value })}
        />
      </Field>
      <Field label={tw("description")}>
        <textarea
          className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-primary"
          rows={5}
          maxLength={1500}
          value={v.description}
          onChange={(e) => set({ description: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={tw("phone")} hint={tw("phoneHint")}>
          <input
            className={input}
            type="tel"
            value={v.phone}
            onChange={(e) => set({ phone: e.target.value })}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MessengerField
          app="viber"
          value={v.viber}
          onChange={(viber) => set({ viber })}
          inputClassName={input}
        />
        <MessengerField
          app="whatsapp"
          value={v.whatsapp}
          onChange={(whatsapp) => set({ whatsapp })}
          inputClassName={input}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={tw("email")}>
          <input
            className={input}
            type="email"
            value={v.email}
            onChange={(e) => set({ email: e.target.value })}
          />
        </Field>
        <Field label={t("website")}>
          <input
            className={input}
            value={v.website}
            onChange={(e) => set({ website: e.target.value })}
          />
        </Field>
        <Field label={t("instagram")}>
          <input
            className={input}
            value={v.instagram}
            placeholder="@"
            onChange={(e) => set({ instagram: e.target.value })}
          />
        </Field>
      </div>
      <Field label={t("address")} hint={t("addressHint")}>
        <input
          className={input}
          value={v.address}
          onChange={(e) => set({ address: e.target.value })}
        />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("languages")}</p>
        <div className="flex flex-wrap gap-2">
          {options.languages.map((l) => {
            const on = v.languages.includes(l.code);
            return (
              <button
                key={l.code}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  set({
                    languages: on
                      ? v.languages.filter((x) => x !== l.code)
                      : [...v.languages, l.code],
                  })
                }
                className={cn(
                  "h-9 rounded-full border px-3.5 text-sm font-medium",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-white",
                )}
              >
                {l.name}
              </button>
            );
          })}
        </div>
      </div>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="size-5"
          checked={v.online}
          onChange={(e) => set({ online: e.target.checked })}
        />
        {tw("online")}
      </label>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="size-5"
          checked={v.emergency}
          onChange={(e) => set({ emergency: e.target.checked })}
        />
        {tw("emergency")}
      </label>
      {button}
    </form>
  );
}

function ServicesTab({
  business,
  options,
}: {
  business: EditorBusiness;
  options: EditorOptions;
}) {
  const tw = useTranslations("Wizard");
  const { run, button, dirty } = useSave();
  const [primary, setPrimary] = useState(business.primaryServiceIds);
  const [other, setOther] = useState(business.otherServiceIds);
  const [cityId, setCityId] = useState(business.cityId);
  const [cityIds, setCityIds] = useState(
    business.cityIds.filter((id) => id !== business.cityId),
  );
  const [query, setQuery] = useState("");
  const name = (id: number) =>
    options.services.find((s) => s.id === id)?.name ?? "";
  const matches = useMemo(() => {
    const q = norm(query.trim());
    return q
      ? options.services.filter((s) => s.search.includes(q)).slice(0, 30)
      : [];
  }, [query, options.services]);

  const add = (id: number) => {
    dirty();
    setQuery("");
    if (primary.includes(id) || other.includes(id)) return;
    if (primary.length < 3) setPrimary([...primary, id]);
    else setOther([...other, id]);
  };
  const remove = (id: number) => {
    dirty();
    setPrimary(primary.filter((x) => x !== id));
    setOther(other.filter((x) => x !== id));
  };
  const chip = (id: number, isPrimary: boolean) => (
    <span
      key={id}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold",
        isPrimary
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {name(id)}
      <button
        type="button"
        onClick={() => remove(id)}
        aria-label={tw("removeService", { name: name(id) })}
      >
        <X className="size-3.5" />
      </button>
    </span>
  );

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        run(() =>
          setServicesAndCities(business.id, {
            primaryIds: primary,
            otherIds: other,
            cityId,
            cityIds,
          }),
        );
      }}
    >
      <div className="space-y-3">
        <p className="font-semibold">{tw("step1")}</p>
        <p className="text-sm text-muted-foreground">{tw("step1Hint")}</p>
        <div className="flex flex-wrap gap-2">
          {primary.map((id) => chip(id, true))}
          {other.map((id) => chip(id, false))}
        </div>
        <div className="relative">
          <Search
            className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            className={cn(input, "pl-10")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tw("searchServices")}
          />
          {matches.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-xl border bg-white shadow-lg">
              {matches.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => add(s.id)}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm hover:bg-muted"
                  >
                    <Plus className="size-4" aria-hidden />
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <p className="font-semibold">{tw("step2")}</p>
        <Field label={tw("mainCity")}>
          <select
            className={input}
            value={cityId}
            onChange={(e) => {
              dirty();
              setCityId(Number(e.target.value));
            }}
          >
            {options.cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parentId ? `— ${c.name}` : c.name}
              </option>
            ))}
          </select>
        </Field>
        <p className="text-sm font-medium">{tw("alsoWorkIn")}</p>
        <div className="flex flex-wrap gap-2">
          {options.cities
            .filter((c) => c.id !== cityId)
            .map((c) => {
              const on = cityIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    dirty();
                    setCityIds(
                      on
                        ? cityIds.filter((x) => x !== c.id)
                        : [...cityIds, c.id],
                    );
                  }}
                  className={cn(
                    "h-8 rounded-full border px-3 text-sm",
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-white",
                    c.parentId && "text-xs",
                  )}
                >
                  {c.name}
                </button>
              );
            })}
        </div>
      </div>
      {button}
    </form>
  );
}

function HoursTab({
  business,
  options,
}: {
  business: EditorBusiness;
  options: EditorOptions;
}) {
  const t = useTranslations("Panel");
  const { run, button, dirty } = useSave();
  const [days, setDays] = useState(() =>
    [1, 2, 3, 4, 5, 6, 7].map((weekday) => {
      const h = business.hours.find((x) => x.weekday === weekday);
      return {
        weekday,
        open: Boolean(h),
        opensAt: h?.opensAt.slice(0, 5) ?? "08:00",
        closesAt: h?.closesAt.slice(0, 5) ?? "16:00",
      };
    }),
  );
  const set = (weekday: number, patch: Partial<(typeof days)[number]>) => {
    dirty();
    setDays((d) =>
      d.map((x) => (x.weekday === weekday ? { ...x, ...patch } : x)),
    );
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        run(() =>
          setHours(
            business.id,
            days
              .filter((d) => d.open)
              .map(({ weekday, opensAt, closesAt }) => ({
                weekday,
                opensAt,
                closesAt,
              })),
          ),
        );
      }}
    >
      <ul className="divide-y rounded-2xl border bg-white">
        {days.map((d) => (
          <li
            key={d.weekday}
            className="flex flex-wrap items-center gap-3 px-4 py-3"
          >
            <span className="w-28 font-medium">
              {options.weekdays[d.weekday - 1]}
            </span>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="size-4"
                checked={!d.open}
                onChange={(e) => set(d.weekday, { open: !e.target.checked })}
              />
              {t("hoursClosed")}
            </label>
            {d.open && (
              <span className="ml-auto flex items-center gap-2">
                <input
                  type="time"
                  className={cn(input, "h-10 w-28")}
                  value={d.opensAt}
                  onChange={(e) => set(d.weekday, { opensAt: e.target.value })}
                />
                –
                <input
                  type="time"
                  className={cn(input, "h-10 w-28")}
                  value={d.closesAt}
                  onChange={(e) => set(d.weekday, { closesAt: e.target.value })}
                />
              </span>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="text-sm font-semibold text-primary hover:underline"
        onClick={() => {
          dirty();
          const mon = days[0];
          setDays((d) =>
            d.map((x) => (x.weekday <= 5 ? { ...mon, weekday: x.weekday } : x)),
          );
        }}
      >
        {t("hoursCopy")}
      </button>
      {button}
    </form>
  );
}

function PricesTab({
  business,
  options,
}: {
  business: EditorBusiness;
  options: EditorOptions;
}) {
  const t = useTranslations("Panel");
  const { run, button, dirty } = useSave();
  const serviceIds = [
    ...business.primaryServiceIds,
    ...business.otherServiceIds,
  ];
  // Prices stay as typed text ("12," mid-keystroke) and become numbers on submit.
  const [rows, setRows] = useState(() =>
    business.prices.map((p) => ({
      ...p,
      priceFrom: p.priceFrom == null ? "" : String(p.priceFrom),
      priceTo: p.priceTo == null ? "" : String(p.priceTo),
    })),
  );
  const update = (i: number, patch: Partial<(typeof rows)[number]>) => {
    dirty();
    setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };
  // Digits plus a single decimal separator (comma or dot).
  const clean = (v: string) => {
    const s = v.replace(/[^\d.,]/g, "");
    const at = s.search(/[.,]/);
    return at < 0
      ? s
      : s.slice(0, at + 1) + s.slice(at + 1).replace(/[.,]/g, "");
  };
  const num = (v: string) => {
    const n = Number(v.replace(",", "."));
    return v === "" || !Number.isFinite(n) ? null : n;
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        run(() =>
          setPriceList(
            business.id,
            rows
              .filter((r) => r.name.trim())
              .map((r) => ({
                ...r,
                priceFrom: num(r.priceFrom),
                priceTo: num(r.priceTo),
              })),
          ),
        );
      }}
    >
      <ul className="space-y-3">
        {rows.map((row, i) => (
          <li
            key={i}
            className="grid gap-2 rounded-2xl border bg-white p-3 sm:grid-cols-[1fr_130px_90px_90px_130px_auto] sm:items-end"
          >
            <Field label={t("priceName")}>
              <input
                className={input}
                value={row.name}
                maxLength={120}
                onChange={(e) => update(i, { name: e.target.value })}
              />
            </Field>
            <Field label={t("priceKind")}>
              <select
                className={input}
                value={row.kind}
                onChange={(e) => update(i, { kind: e.target.value as Kind })}
              >
                {(
                  ["fixed", "from", "range", "on_request", "free"] as const
                ).map((k) => (
                  <option key={k} value={k}>
                    {t(`priceKinds.${k}`)}
                  </option>
                ))}
              </select>
            </Field>
            {row.kind === "on_request" || row.kind === "free" ? (
              <span className="hidden sm:col-span-2 sm:block" />
            ) : (
              <>
                <Field label={t("priceFrom")}>
                  <input
                    className={input}
                    inputMode="decimal"
                    value={row.priceFrom}
                    onChange={(e) =>
                      update(i, { priceFrom: clean(e.target.value) })
                    }
                  />
                </Field>
                {row.kind === "range" ? (
                  <Field label={t("priceTo")}>
                    <input
                      className={input}
                      inputMode="decimal"
                      value={row.priceTo}
                      onChange={(e) =>
                        update(i, { priceTo: clean(e.target.value) })
                      }
                    />
                  </Field>
                ) : (
                  <span className="hidden sm:block" />
                )}
              </>
            )}
            <Field label={t("priceUnit")}>
              <select
                className={input}
                value={row.unit}
                onChange={(e) => update(i, { unit: e.target.value as Unit })}
              >
                {(Object.keys(options.units) as Unit[]).map((u) => (
                  <option key={u} value={u}>
                    {options.units[u]}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              onClick={() => {
                dirty();
                setRows((r) => r.filter((_, j) => j !== i));
              }}
              className="flex h-11 items-center justify-center rounded-xl px-3 text-muted-foreground hover:text-destructive"
              aria-label={t("priceRemove")}
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          dirty();
          setRows((r) => [
            ...r,
            {
              name: "",
              kind: "fixed",
              priceFrom: "",
              priceTo: "",
              unit: "job",
              serviceId: serviceIds[0] ?? null,
            },
          ]);
        }}
        className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold hover:bg-muted"
      >
        <Plus className="size-4" aria-hidden />
        {t("priceAdd")}
      </button>
      {button}
    </form>
  );
}

function PhotosTab({ business }: { business: EditorBusiness }) {
  const t = useTranslations("Panel");
  const tw = useTranslations("Wizard");
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const left = 10 - business.photos.length;

  const act = (fn: () => Promise<{ ok: boolean }>) =>
    startTransition(async () => {
      const res = await fn();
      setError(res.ok ? null : tw("errors.generic"));
      router.refresh();
    });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {tw("photosHint")} {t("photosLimit")}
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {business.photos.map((p) => (
          <li
            key={p.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
          >
            <Image
              src={p.url}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover"
            />
            {p.isCover && (
              <span className="absolute top-2 left-2 rounded-full bg-warm px-2 py-0.5 text-xs font-bold text-warm-foreground">
                {t("photosCover")}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 p-2">
              {!p.isCover && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => act(() => setCoverPhoto(business.id, p.id))}
                  className="rounded-full bg-white/90 p-1.5"
                  title={t("photosMakeCover")}
                  aria-label={t("photosMakeCover")}
                >
                  <Star className="size-4" />
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => act(() => deletePhoto(business.id, p.id))}
                className="rounded-full bg-white/90 p-1.5"
                title={t("photosDelete")}
                aria-label={t("photosDelete")}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
        {left > 0 && (
          <li>
            <button
              type="button"
              disabled={pending}
              onClick={() => fileInput.current?.click()}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-sm font-medium text-muted-foreground hover:border-primary/40"
            >
              {pending ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <ImagePlus className="size-6" aria-hidden />
              )}
              {progress ?? tw("addPhotos")}
            </button>
          </li>
        )}
      </ul>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).slice(0, left);
          e.target.value = "";
          if (!files.length) return;
          startTransition(async () => {
            const uploaded = await uploadPhotos(
              business.id,
              files,
              (done, total) => setProgress(tw("uploading", { done, total })),
            );
            const res = uploaded.length
              ? await addPhotos(business.id, uploaded)
              : { ok: false };
            setProgress(null);
            const failed = files.length - uploaded.length;
            setError(
              uploaded.length && !res.ok
                ? tw("errors.generic")
                : failed
                  ? tw("errors.photosFailed", { failed, total: files.length })
                  : null,
            );
            router.refresh();
          });
        }}
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// Formatted in the configured time zone (Europe/Podgorica) so server and
// browser render the same date.
const dateFormat = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
} as const;

function ReviewsTab({ business }: { business: EditorBusiness }) {
  const t = useTranslations("Panel");
  if (!business.reviews.length)
    return (
      <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        {t("reviewsEmpty")}
      </p>
    );
  return (
    <ul className="space-y-4">
      {business.reviews.map((r) => (
        <ReviewReply key={r.id} review={r} />
      ))}
    </ul>
  );
}

function ReviewReply({
  review,
}: {
  review: EditorBusiness["reviews"][number];
}) {
  const t = useTranslations("Panel");
  const tr = useTranslations("Review");
  const format = useFormatter();
  const router = useRouter();
  const [reply, setReply] = useState(review.reply ?? "");
  const [saved, setSaved] = useState(review.reply);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  const save = (text: string) =>
    startTransition(async () => {
      const res = await replyToReview(review.id, text);
      setError(!res.ok);
      if (!res.ok) return;
      setSaved(text.trim() || null);
      setReply(text.trim());
      setEditing(false);
      router.refresh();
    });

  return (
    <li
      className={cn(
        "space-y-3 rounded-2xl border bg-white p-4",
        review.hidden && "opacity-60",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          {review.author}
          <span className="font-normal text-muted-foreground">
            {" "}
            · {format.dateTime(new Date(review.createdAt), dateFormat)}
          </span>
          {review.hidden && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              {t("reviewHidden")}
            </span>
          )}
        </p>
        <Stars value={review.rating} />
      </div>
      {review.body && (
        <p className="text-[15px] leading-relaxed whitespace-pre-line">
          {review.body}
        </p>
      )}
      {saved && !editing ? (
        <div className="ml-4 space-y-2 rounded-xl bg-muted p-3 text-sm">
          <p className="font-semibold">{t("yourReply")}</p>
          <p className="whitespace-pre-line text-muted-foreground">{saved}</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="font-medium text-primary hover:underline"
            >
              {t("replyEdit")}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => save("")}
              className="font-medium text-destructive hover:underline"
            >
              {t("replyDelete")}
            </button>
          </div>
        </div>
      ) : editing || !saved ? (
        <form
          className="ml-4 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (reply.trim()) save(reply);
          }}
        >
          {editing || reply ? (
            <>
              <textarea
                className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-primary"
                rows={3}
                maxLength={2000}
                value={reply}
                autoFocus={editing}
                placeholder={t("replyPlaceholder")}
                onChange={(e) => setReply(e.target.value)}
              />
              <button
                type="submit"
                disabled={pending || !reply.trim()}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                {t("replySave")}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t("reply")}
            </button>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {tr("errors.generic")}
            </p>
          )}
        </form>
      ) : null}
    </li>
  );
}

function CopyField({ value, label }: { value: string; label: string }) {
  const t = useTranslations("Share");
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex gap-2">
      <input
        readOnly
        aria-label={label}
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        className={cn(input, "font-mono text-sm")}
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
          } catch {
            // Clipboard blocked (permissions, insecure context): the field is
            // still selectable for a manual copy.
            return;
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border bg-white px-4 text-sm font-semibold hover:bg-muted"
      >
        {copied && <Check className="size-4" />}
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}

/** Profile link, website badge and QR code: backlinks and offline reach. */
function ShareTab({ business }: { business: EditorBusiness }) {
  const t = useTranslations("Share");
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const profileUrl = `${site}/b/${business.slug}`;
  const badgeUrl = `${site}/api/badge/${business.slug}`;
  const badgeHtml = `<a href="${profileUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" width="240" height="64" alt="${business.name} na Tražim"></a>`;

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h3 className="font-bold">{t("linkTitle")}</h3>
        <CopyField value={profileUrl} label={t("linkTitle")} />
      </section>
      <section className="space-y-3">
        <h3 className="font-bold">{t("badgeTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("badgeHint")}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/badge/${business.slug}`}
          width={240}
          height={64}
          alt=""
        />
        <CopyField value={badgeHtml} label={t("badgeTitle")} />
      </section>
      <section className="space-y-3">
        <h3 className="font-bold">{t("qrTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("qrHint")}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/qr/${business.slug}`}
          width={160}
          height={160}
          alt=""
          className="rounded-xl border bg-white p-2"
        />
        <a
          href={`/api/qr/${business.slug}`}
          download={`trazim-${business.slug}-qr.svg`}
          className="inline-block text-sm font-semibold text-primary hover:underline"
        >
          {t("qrDownload")}
        </a>
      </section>
      <section className="space-y-1 rounded-2xl bg-secondary/60 p-4">
        <h3 className="font-bold">{t("gbpTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("gbpHint")}</p>
      </section>
    </div>
  );
}

function InquiriesTab({ business }: { business: EditorBusiness }) {
  const t = useTranslations("PanelInquiries");
  if (!business.inquiries.length)
    return (
      <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        {t("empty")}
      </p>
    );
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("intro")}</p>
      <ul className="space-y-3">
        {business.inquiries.map((i) => (
          <InquiryCard key={i.id} inquiry={i} businessId={business.id} />
        ))}
      </ul>
    </div>
  );
}

function InquiryCard({
  inquiry,
  businessId,
}: {
  inquiry: EditorBusiness["inquiries"][number];
  businessId: string;
}) {
  const t = useTranslations("PanelInquiries");
  const ti = useTranslations("Inquiry");
  const format = useFormatter();
  const [contact, setContact] = useState<{
    phone: string;
    name: string | null;
  } | null>(null);
  const [error, setError] = useState<"limit" | "generic" | null>(null);
  const [pending, startTransition] = useTransition();
  const digits = contact?.phone.replace(/[^\d+]/g, "") ?? "";

  return (
    <li className="space-y-3 rounded-2xl border bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">
          {inquiry.service} · {inquiry.city}
        </span>
        {inquiry.urgent && (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
            {t("urgent")}
          </span>
        )}
        {inquiry.direct && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary">
            {t("direct")}
          </span>
        )}
        <span className="text-muted-foreground">
          {format.dateTime(new Date(inquiry.createdAt), dateFormat)}
          {inquiry.when &&
            ` · ${ti(`whenOptions.${inquiry.when}` as "whenOptions.asap")}`}
        </span>
      </div>
      <p className="text-[15px] leading-relaxed whitespace-pre-line">
        {inquiry.body}
      </p>
      {contact ? (
        <div className="flex flex-wrap items-center gap-2">
          {contact.name && (
            <span className="text-sm font-medium">{contact.name}</span>
          )}
          <a
            href={`tel:${digits}`}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Phone className="size-4" aria-hidden />
            {t("call")} {contact.phone}
          </a>
          <a
            href={`viber://chat?number=${encodeURIComponent(digits)}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
          >
            <ViberIcon className="size-4" />
            Viber
          </a>
          <a
            href={`https://wa.me/${digits.replace(/^\+/, "")}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await revealInquiry(inquiry.id, businessId);
                if (!res.ok)
                  return setError(res.error === "limit" ? "limit" : "generic");
                setContact({ phone: res.phone, name: res.name });
              })
            }
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {t("reveal")}
          </button>
          {inquiry.revealed && (
            <span className="text-xs text-muted-foreground">
              {t("contacted")}
            </span>
          )}
          {error && (
            <span role="alert" className="text-sm text-destructive">
              {error === "limit" ? t("revealLimit") : ti("errors.generic")}
            </span>
          )}
        </div>
      )}
    </li>
  );
}
