"use client";

import { Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { createInquiry, type InquiryInput } from "@/app/actions/inquiries";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Option = { id: number; name: string };
type When = InquiryInput["preferredTime"];
type Draft = {
  key: string;
  serviceId: number | null;
  cityId: number | null;
  body: string;
  preferredTime: When;
  urgent: boolean;
  phone: string;
  savedAt: number;
};

// localStorage: the email sign-in link opens a new tab.
const DRAFT_KEY = "trazim.inquiry";
const DRAFT_TTL = 24 * 3600_000;
const WHEN: When[] = ["asap", "this_week", "this_month", "flexible"];

const field =
  "h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] outline-none focus:border-primary";

function readDraft(key: string): Draft | null {
  try {
    const d = JSON.parse(
      localStorage.getItem(DRAFT_KEY) ?? "null",
    ) as Draft | null;
    return d && d.key === key && Date.now() - d.savedAt < DRAFT_TTL ? d : null;
  } catch {
    return null;
  }
}

/**
 * "Pošalji upit": describe the job once; every business offering the service
 * in the town (or just `businessId`) sees it. Sign-in is asked on submit and
 * the draft survives it.
 */
export function InquiryButton({
  serviceId,
  cityId,
  businessId,
  businessName,
  services,
  cities = [],
  variant = "primary",
  className,
}: {
  serviceId?: number;
  cityId?: number;
  businessId?: string;
  businessName?: string;
  /** Options when the service isn't fixed by the page. */
  services?: Option[];
  /** Options when the town isn't fixed by the page. */
  cities?: Option[];
  variant?: "primary" | "outline";
  className?: string;
}) {
  const t = useTranslations("Inquiry");
  const { user, ready, openLogin } = useAuth();
  const key = businessId ?? `${serviceId ?? "any"}-${cityId ?? "any"}`;
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<number | null>(serviceId ?? null);
  const [city, setCity] = useState<number | null>(cityId ?? null);
  const [body, setBody] = useState("");
  const [when, setWhen] = useState<When>("asap");
  const [urgent, setUrgent] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Back from signing in: reopen the saved request.
  useEffect(() => {
    if (!ready || !user) return;
    const draft = readDraft(key);
    if (!draft) return;
    queueMicrotask(() => {
      setService(draft.serviceId);
      setCity(draft.cityId);
      setBody(draft.body);
      setWhen(draft.preferredTime);
      setUrgent(draft.urgent);
      setPhone(draft.phone);
      setNotice(t("draftRestored"));
      setOpen(true);
    });
  }, [ready, user, key, t]);

  function submit() {
    setError(null);
    if (!service) return setError(t("errors.service"));
    if (!city) return setError(t("errors.city"));
    if (body.trim().length < 20) return setError(t("errors.body"));
    if (phone.replace(/\D/g, "").length < 6) return setError(t("errors.phone"));
    if (!user) {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            key,
            serviceId: service,
            cityId: city,
            body,
            preferredTime: when,
            urgent,
            phone,
            savedAt: Date.now(),
          } satisfies Draft),
        );
      } catch {}
      setOpen(false);
      openLogin({ title: t("readyTitle"), description: t("readyText") });
      return;
    }
    startTransition(async () => {
      const res = await createInquiry({
        serviceId: service,
        cityId: city,
        businessId: businessId ?? null,
        body,
        preferredTime: when,
        urgent,
        phone,
      });
      if (!res.ok) {
        setError(
          ["body", "phone", "service", "city", "limit"].includes(res.error)
            ? t(`errors.${res.error}` as "errors.body")
            : t("errors.generic"),
        );
        return;
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setOpen(false);
      setBody("");
      setDone(
        businessId ? t("sentBusiness") : t("sent", { count: res.recipients }),
      );
    });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setNotice(null);
          setDone(null);
          setOpen(true);
        }}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 font-semibold sm:w-auto",
          variant === "primary"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border bg-white hover:bg-muted",
        )}
      >
        <Send className="size-4" aria-hidden />
        {businessId ? t("buttonBusiness") : t("button")}
      </button>
      {done && (
        <p role="status" className="text-sm font-medium text-primary">
          {done}
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg gap-5 overflow-y-auto rounded-2xl p-6">
          <div className="space-y-1.5 pr-6">
            <DialogTitle className="text-xl font-bold">
              {businessName
                ? t("titleBusiness", { name: businessName })
                : t("title")}
            </DialogTitle>
            <DialogDescription>
              {businessId ? t("subtitleBusiness") : t("subtitle")}
            </DialogDescription>
          </div>
          {notice && (
            <p className="rounded-xl bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">
              {notice}
            </p>
          )}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            {services && !serviceId && (
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">{t("service")}</span>
                <select
                  className={field}
                  value={service ?? ""}
                  onChange={(e) => setService(Number(e.target.value) || null)}
                >
                  <option value="">{t("chooseService")}</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {!cityId && (
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">{t("city")}</span>
                <select
                  className={field}
                  value={city ?? ""}
                  onChange={(e) => setCity(Number(e.target.value) || null)}
                >
                  <option value="">{t("chooseCity")}</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{t("body")}</span>
              <textarea
                className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-primary"
                rows={4}
                maxLength={4000}
                value={body}
                placeholder={t("bodyPlaceholder")}
                onChange={(e) => setBody(e.target.value)}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">{t("when")}</span>
                <select
                  className={field}
                  value={when}
                  onChange={(e) => setWhen(e.target.value as When)}
                >
                  {WHEN.map((w) => (
                    <option key={w} value={w}>
                      {t(`whenOptions.${w}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">{t("phone")}</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  className={field}
                  value={phone}
                  placeholder="067 123 456"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">{t("phoneHint")}</p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="size-4 accent-primary"
              />
              {t("urgent")}
            </label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {pending ? t("sending") : t("submit")}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
