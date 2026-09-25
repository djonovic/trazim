"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useAlternates } from "./alternates";

const labels: Record<Locale, { short: string; long: string }> = {
  "sr-Latn-ME": { short: "ME", long: "Crnogorski" },
  en: { short: "EN", long: "English" },
  ru: { short: "RU", long: "Русский" },
};

const homePaths: Record<Locale, string> = {
  "sr-Latn-ME": "/",
  en: "/en",
  ru: "/ru",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const current = useLocale();
  const t = useTranslations("Common");
  const alternates = useAlternates();

  return (
    <nav
      aria-label={t("language")}
      className={cn("flex items-center gap-0.5", className)}
    >
      <Globe className="mr-1 size-4 text-muted-foreground" aria-hidden />
      {routing.locales.map((locale) => (
        // Plain <a>: switching locale reloads messages for the whole tree.
        <a
          key={locale}
          href={alternates?.[locale] ?? homePaths[locale]}
          hrefLang={locale}
          lang={locale}
          title={labels[locale].long}
          aria-current={locale === current ? "true" : undefined}
          className={cn(
            "rounded-md px-1.5 py-1 text-xs font-semibold transition-colors",
            locale === current
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {labels[locale].short}
        </a>
      ))}
    </nav>
  );
}
