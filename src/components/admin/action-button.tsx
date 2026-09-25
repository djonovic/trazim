"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import type { AdminResult } from "@/app/actions/admin";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ERRORS: Record<string, string> = {
  note: "Unesi razlog.",
  auth: "Nemaš admin pristup.",
};

const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  default: "border bg-white hover:bg-muted",
  danger:
    "border border-destructive/40 text-destructive hover:bg-destructive/5",
};

/**
 * Runs a bound admin server action, e.g. moderateBusiness.bind(null, id, "approve").
 * With `note`, asks for a short text first (required when `noteRequired`).
 */
export function ActionButton({
  action,
  label,
  variant = "default",
  confirm,
  note,
  noteRequired = false,
}: {
  action: (note?: string) => Promise<AdminResult>;
  label: string;
  variant?: keyof typeof VARIANTS;
  confirm?: string;
  note?: string;
  noteRequired?: boolean;
}) {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (value?: string) =>
    startTransition(async () => {
      setError(null);
      const res = await action(value);
      if (!res.ok) {
        setError(ERRORS[res.error] ?? "Nije uspjelo. Pokušaj ponovo.");
        return;
      }
      setAsking(false);
      setText("");
      router.refresh();
    });

  const button = (onClick: () => void, children = label) => (
    <button
      type="button"
      disabled={pending}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold whitespace-nowrap disabled:opacity-60",
        VARIANTS[variant],
      )}
    >
      {pending && <Loader2 className="size-3.5 animate-spin" />}
      {children}
    </button>
  );

  if (asking)
    return (
      <form
        className="w-full space-y-2 rounded-xl border bg-muted/40 p-3 sm:max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          if (noteRequired && !text.trim()) return setError(ERRORS.note);
          run(text);
        }}
      >
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{note}</span>
          <textarea
            className="w-full rounded-lg border bg-white px-3 py-2 outline-none focus:border-primary"
            rows={2}
            maxLength={1000}
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold disabled:opacity-60",
              VARIANTS[variant === "default" ? "primary" : variant],
            )}
          >
            {pending && <Loader2 className="size-3.5 animate-spin" />}
            {label}
          </button>
          <button
            type="button"
            onClick={() => setAsking(false)}
            className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            Otkaži
          </button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>
    );

  return (
    <span className="inline-flex flex-col items-start gap-1">
      {button(() => {
        if (note) return setAsking(true);
        if (confirm && !window.confirm(confirm)) return;
        run();
      })}
      {error && (
        <span role="alert" className="text-xs text-destructive">
          {error}
        </span>
      )}
    </span>
  );
}
