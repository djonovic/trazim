"use client";

import { useTranslations } from "next-intl";
import { ViberIcon, WhatsAppIcon } from "@/components/icons/apps";
import type { MessengerMode } from "@/lib/business-input";
import { cn } from "@/lib/utils";

export type MessengerValue = { mode: MessengerMode; number: string };

const MODES: MessengerMode[] = ["same", "other", "none"];

/** Viber / WhatsApp: not used, same number as the phone, or another number. */
export function MessengerField({
  app,
  value,
  onChange,
  inputClassName,
}: {
  app: "viber" | "whatsapp";
  value: MessengerValue;
  onChange: (value: MessengerValue) => void;
  inputClassName: string;
}) {
  const t = useTranslations("Wizard");
  const Icon = app === "viber" ? ViberIcon : WhatsAppIcon;
  const name = app === "viber" ? "Viber" : "WhatsApp";

  return (
    <fieldset className="space-y-2">
      <legend className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4" />
        {name}
      </legend>
      <div className="flex flex-wrap gap-2">
        {MODES.map((mode) => (
          <label
            key={mode}
            className={cn(
              "inline-flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring/50",
              value.mode === mode
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-white hover:border-primary",
            )}
          >
            <input
              type="radio"
              name={`${app}-mode`}
              value={mode}
              checked={value.mode === mode}
              onChange={() => onChange({ ...value, mode })}
              className="sr-only"
            />
            {t(`messenger.${mode}`)}
          </label>
        ))}
      </div>
      {value.mode === "other" && (
        <input
          value={value.number}
          onChange={(e) => onChange({ ...value, number: e.target.value })}
          placeholder={t("phonePlaceholder")}
          aria-label={t("messenger.number", { app: name })}
          type="tel"
          inputMode="tel"
          className={inputClassName}
        />
      )}
    </fieldset>
  );
}
