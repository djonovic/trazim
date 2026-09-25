"use client";

import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LocaleFlag } from "@/components/icons/flags";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const current = useLocale() as Locale;
  const t = useTranslations("Common");
  const alternates = useAlternates();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={`${t("language")}: ${labels[current].long}`}
        className={cn(
          "group flex h-10 items-center gap-1.5 rounded-full border bg-white pr-2.5 pl-2 text-sm font-semibold transition-colors outline-none hover:border-primary/40 hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:border-primary/40 data-[state=open]:bg-muted/50",
          className,
        )}
      >
        <LocaleFlag locale={current} />
        <span>{labels[current].short}</span>
        <ChevronDown
          className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t("language")}
        </DropdownMenuLabel>
        {routing.locales.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            {/* Plain <a>: switching locale reloads messages for the whole tree. */}
            <a
              href={alternates?.[locale] ?? homePaths[locale]}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === current ? "true" : undefined}
              className={cn(locale === current && "font-semibold")}
            >
              <LocaleFlag locale={locale} className="size-6" />
              <span className="flex-1">{labels[locale].long}</span>
              {locale === current && (
                <Check className="text-primary!" aria-hidden />
              )}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
