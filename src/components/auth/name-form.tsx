"use client";

import { Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { updateName } from "@/app/actions/account";

export function NameForm({ initial }: { initial: string }) {
  const t = useTranslations("Account");
  const [name, setName] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await updateName(name);
          setSaved(res.ok);
        });
      }}
    >
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">{t("name")}</span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          placeholder={t("namePlaceholder")}
          autoComplete="name"
          minLength={2}
          maxLength={80}
          required
          className="h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:border-primary"
        />
      </label>
      <p className="text-sm text-muted-foreground">{t("nameHint")}</p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : saved ? (
          <Check className="size-4" />
        ) : null}
        {saved ? t("saved") : t("save")}
      </button>
    </form>
  );
}
