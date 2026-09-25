"use client";

import { Flag, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { createReport } from "@/app/actions/reviews";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const REASONS = [
  "false_info",
  "inappropriate",
  "abusive",
  "spam",
  "other",
] as const;

/** "Prijavi" for a business profile or a single review. Requires sign-in. */
export function ReportButton({
  target,
  businessId,
  reviewId,
  label,
  className,
}: {
  target: "business" | "review";
  businessId?: string;
  reviewId?: string;
  label?: string;
  className?: string;
}) {
  const t = useTranslations("Report");
  const { user, openLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<(typeof REASONS)[number] | null>(null);
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function start() {
    if (!user) {
      openLogin({ title: t("loginTitle"), description: t("loginText") });
      return;
    }
    setError(null);
    setDone(null);
    setOpen(true);
  }

  function submit() {
    if (!reason) return setError(t("errors.reason"));
    setError(null);
    startTransition(async () => {
      const res = await createReport({
        target,
        businessId,
        reviewId,
        reason,
        details,
      });
      if (!res.ok) {
        setError(
          res.error === "limit" ? t("errors.limit") : t("errors.generic"),
        );
        return;
      }
      setDone(res.already ? t("already") : t("sent"));
      setReason(null);
      setDetails("");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={start}
        className={cn(
          "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground",
          className,
        )}
      >
        <Flag className="size-3.5" aria-hidden />
        {label ?? t("button")}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md gap-5 rounded-2xl p-6">
          <div className="space-y-1.5 pr-6">
            <DialogTitle className="text-xl font-bold">
              {target === "business" ? t("businessTitle") : t("reviewTitle")}
            </DialogTitle>
            {done && (
              <DialogDescription role="status">{done}</DialogDescription>
            )}
          </div>
          {!done && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <fieldset className="space-y-2">
                <legend className="mb-1 text-sm font-medium">
                  {t("reasonLabel")}
                </legend>
                {REASONS.map((r) => (
                  <label
                    key={r}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[15px]",
                      reason === r && "border-primary bg-secondary",
                    )}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-primary"
                    />
                    {t(`reasons.${r}`)}
                  </label>
                ))}
              </fieldset>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">{t("details")}</span>
                <textarea
                  className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-primary"
                  rows={3}
                  maxLength={1000}
                  value={details}
                  placeholder={t("detailsPlaceholder")}
                  onChange={(e) => setDetails(e.target.value)}
                />
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
                {t("submit")}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
