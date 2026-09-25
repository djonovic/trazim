"use client";

import { Check, ImagePlus, Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { addPhotos, createBusiness } from "@/app/actions/business";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "@/i18n/navigation";
import { uploadPhotos } from "@/lib/upload-photos";
import { cn } from "@/lib/utils";

export type WizardService = {
  id: number;
  name: string;
  group: string;
  search: string;
};
export type WizardCity = {
  id: number;
  name: string;
  region: string;
  parentId: number | null;
};

type Draft = {
  step: 1 | 2 | 3;
  serviceIds: number[];
  cityId: number | null;
  extraCityIds: number[];
  online: boolean;
  emergency: boolean;
  name: string;
  description: string;
  phone: string;
  viberSame: boolean;
  whatsappSame: boolean;
  email: string;
  webLink: string;
};

const DRAFT_KEY = "trazim.wizard";
const emptyDraft: Draft = {
  step: 1,
  serviceIds: [],
  cityId: null,
  extraCityIds: [],
  online: false,
  emergency: false,
  name: "",
  description: "",
  phone: "",
  viberSame: true,
  whatsappSame: true,
  email: "",
  webLink: "",
};

const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "dj");

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...emptyDraft, ...JSON.parse(raw) } : emptyDraft;
  } catch {
    return emptyDraft;
  }
}

type WizardProps = {
  services: WizardService[];
  cities: WizardCity[];
  regions: string[];
};

const subscribe = () => () => {};

/**
 * Rendered only in the browser: the draft lives in localStorage so it
 * survives the Google redirect and the email link (a new tab).
 */
export function BusinessWizard(props: WizardProps) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!hydrated)
    return (
      <div className="h-96 animate-pulse rounded-2xl bg-muted" aria-hidden />
    );
  return <WizardSteps {...props} />;
}

function WizardSteps({ services, cities, regions }: WizardProps) {
  const t = useTranslations("Wizard");
  const tp = useTranslations("Panel");
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Storage blocked: the wizard still works, it just won't survive a redirect.
    }
  }, [draft]);

  const update = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setError(null);
  };

  const previews = useMemo(
    () => photos.map((f) => URL.createObjectURL(f)),
    [photos],
  );
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const matches = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return services;
    return services.filter((s) => s.search.includes(q));
  }, [query, services]);

  const toggleService = (id: number) => {
    const has = draft.serviceIds.includes(id);
    if (!has && draft.serviceIds.length >= 3) return;
    update({
      serviceIds: has
        ? draft.serviceIds.filter((x) => x !== id)
        : [...draft.serviceIds, id],
    });
  };
  const toggleCity = (id: number) =>
    update({
      extraCityIds: draft.extraCityIds.includes(id)
        ? draft.extraCityIds.filter((x) => x !== id)
        : [...draft.extraCityIds, id],
    });

  function next() {
    if (draft.step === 1 && !draft.serviceIds.length)
      return setError(t("errors.services"));
    if (draft.step === 2 && !draft.cityId) return setError(t("errors.city"));
    update({ step: (draft.step + 1) as Draft["step"] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit() {
    if (!user) {
      openLogin({ title: t("loginFirst"), description: t("loginFirstText") });
      return;
    }
    startTransition(async () => {
      const result = await createBusiness({
        serviceIds: draft.serviceIds,
        cityId: draft.cityId ?? 0,
        extraCityIds: draft.extraCityIds,
        online: draft.online,
        emergency: draft.emergency,
        name: draft.name,
        description: draft.description,
        phone: draft.phone,
        viberSame: draft.viberSame,
        whatsappSame: draft.whatsappSame,
        email: draft.email,
        webLink: draft.webLink,
      });
      if (!result.ok) {
        const field = result.fields?.[0];
        const known = ["services", "city", "name", "phone", "email"];
        setError(
          field && known.includes(field)
            ? t(`errors.${field}` as "errors.name")
            : t("errors.generic"),
        );
        return;
      }
      if (photos.length) {
        setProgress(t("uploading", { done: 0, total: photos.length }));
        const uploaded = await uploadPhotos(result.id, photos, (done, total) =>
          setProgress(t("uploading", { done, total })),
        );
        if (uploaded.length) await addPhotos(result.id, uploaded);
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      router.push({
        pathname: "/panel/[id]",
        params: { id: result.id },
        query: { created: "1" },
      });
    });
  }

  const field =
    "focus:border-primary h-12 w-full rounded-xl border bg-white px-4 text-base outline-none";
  const municipalities = cities.filter((c) => !c.parentId);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {t("step", { current: draft.step, total: 3 })}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                s <= draft.step ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>
      </div>

      {draft.step === 1 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{t("step1")}</h2>
            <p className="text-muted-foreground">{t("step1Hint")}</p>
          </div>
          {draft.serviceIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {draft.serviceIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleService(id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground"
                >
                  {services.find((s) => s.id === id)?.name}
                  <X className="size-3.5" aria-hidden />
                </button>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {t("selected", { count: draft.serviceIds.length })}
          </p>
          <label className="relative block">
            <Search
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchServices")}
              className={cn(field, "pl-10")}
            />
          </label>
          <ul className="max-h-[50vh] divide-y overflow-y-auto rounded-2xl border bg-white">
            {matches.map((s) => {
              const selected = draft.serviceIds.includes(s.id);
              const disabled = !selected && draft.serviceIds.length >= 3;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => toggleService(s.id)}
                    disabled={disabled}
                    aria-pressed={selected}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted disabled:opacity-40"
                  >
                    <span>
                      <span className="font-medium">{s.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {s.group}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-md border",
                        selected &&
                          "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {selected && <Check className="size-4" aria-hidden />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {draft.step === 2 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold">{t("step2")}</h2>
            <p className="text-muted-foreground">{t("step2Hint")}</p>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("mainCity")}</span>
            <select
              value={draft.cityId ?? ""}
              onChange={(e) =>
                update({ cityId: Number(e.target.value) || null })
              }
              className={field}
            >
              <option value="">{t("chooseCity")}</option>
              {regions.map((region) => (
                <optgroup key={region} label={region}>
                  {cities
                    .filter((c) => c.region === region)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("alsoWorkIn")}</p>
            <div className="flex flex-wrap gap-2">
              {municipalities
                .filter((c) => c.id !== draft.cityId)
                .map((c) => {
                  const on = draft.extraCityIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleCity(c.id)}
                      className={cn(
                        "h-9 rounded-full border px-3.5 text-sm font-medium",
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-white hover:border-primary/40",
                      )}
                    >
                      {c.name}
                    </button>
                  );
                })}
            </div>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={draft.online}
              onChange={(e) => update({ online: e.target.checked })}
              className="size-5"
            />
            {t("online")}
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={draft.emergency}
              onChange={(e) => update({ emergency: e.target.checked })}
              className="size-5"
            />
            {t("emergency")}
          </label>
        </section>
      )}

      {draft.step === 3 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-bold">{t("step3")}</h2>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("name")}</span>
            <input
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder={t("namePlaceholder")}
              maxLength={80}
              className={field}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("description")}</span>
            <textarea
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder={t("descriptionPlaceholder")}
              maxLength={1500}
              rows={4}
              className="w-full rounded-xl border bg-white px-4 py-3 text-base outline-none focus:border-primary"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("phone")}</span>
            <input
              value={draft.phone}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder={t("phonePlaceholder")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={field}
            />
            <span className="block text-sm text-muted-foreground">
              {t("phoneHint")}
            </span>
          </label>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.viberSame}
                onChange={(e) => update({ viberSame: e.target.checked })}
                className="size-5"
              />
              {t("viberSame")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.whatsappSame}
                onChange={(e) => update({ whatsappSame: e.target.checked })}
                className="size-5"
              />
              {t("whatsappSame")}
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{t("email")}</span>
              <input
                value={draft.email}
                onChange={(e) => update({ email: e.target.value })}
                type="email"
                inputMode="email"
                className={field}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{t("website")}</span>
              <input
                value={draft.webLink}
                onChange={(e) => update({ webLink: e.target.value })}
                placeholder="@instagram / sajt.me"
                className={field}
              />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">{t("photos")}</p>
            <p className="text-sm text-muted-foreground">{t("photosHint")}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {previews.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-xl bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                  <img src={src} alt="" className="size-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-warm px-2 py-0.5 text-[10px] font-bold text-warm-foreground">
                      {tp("photosCover")}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setPhotos((p) => p.filter((_, j) => j !== i))
                    }
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                    aria-label={tp("photosDelete")}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              {photos.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-xs font-medium text-muted-foreground hover:border-primary/40"
                >
                  <ImagePlus className="size-6" aria-hidden />
                  {t("addPhotos")}
                </button>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                setPhotos((p) => [...p, ...files].slice(0, 10));
                e.target.value = "";
              }}
            />
          </div>
        </section>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:p-0">
        {draft.step > 1 && (
          <button
            type="button"
            onClick={() => update({ step: (draft.step - 1) as Draft["step"] })}
            disabled={pending}
            className="h-12 rounded-full border px-6 font-semibold hover:bg-muted"
          >
            {t("back")}
          </button>
        )}
        {draft.step < 3 ? (
          <button
            type="button"
            onClick={next}
            className="h-12 flex-1 rounded-full bg-primary px-6 font-semibold text-primary-foreground sm:flex-none"
          >
            {t("next")}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60 sm:flex-none"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {progress ?? (pending ? t("submitting") : t("submit"))}
          </button>
        )}
      </div>
    </div>
  );
}
