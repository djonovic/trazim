import { Check, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ViberIcon, WhatsAppIcon } from "@/components/icons/apps";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatEur } from "@/lib/format";
import {
  BANNER_PRICES,
  SITE,
  SPONSOR_PRICES,
  SPONSOR_YEAR_MONTHS,
} from "@/lib/site";

const ROWS = ["other", "home"] as const;

const contactButton =
  "inline-flex h-11 items-center gap-2 rounded-full border bg-white px-4 text-sm font-semibold hover:bg-muted";

function contactLinks(subject: string) {
  const digits = SITE.phoneTel.replace(/\D/g, "");
  return [
    { href: `tel:${SITE.phoneTel}`, label: "call" as const, icon: Phone },
    {
      href: `viber://chat?number=${encodeURIComponent(SITE.phoneTel)}`,
      label: "viber" as const,
      icon: ViberIcon,
    },
    {
      href: `https://wa.me/${digits}`,
      label: "whatsapp" as const,
      icon: WhatsAppIcon,
    },
    {
      href: `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`,
      label: "email" as const,
      icon: Mail,
    },
  ];
}

/** Public price list for sponsored placements (/za-biznise). */
export async function SponsorPricing({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Pricing" });
  const tb = await getTranslations({ locale, namespace: "BannerPricing" });
  const tc = await getTranslations({ locale, namespace: "Profile" });
  const eur = (v: number) => formatEur(v, locale);
  const year = (scope: (typeof ROWS)[number]) =>
    eur(SPONSOR_PRICES[scope] * SPONSOR_YEAR_MONTHS);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-lg font-bold">{t("free")}</p>
          <p className="text-2xl font-extrabold text-primary">
            {t("freePrice")}
          </p>
        </div>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {t("freeText")}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-lg font-bold">{t("sponsoredTitle")}</p>
          <p className="text-[15px] text-muted-foreground">
            {t("sponsoredText")}
          </p>
        </div>

        {/* Phones: one card per placement. */}
        <ul className="space-y-3 sm:hidden">
          {ROWS.map((scope) => (
            <li key={scope} className="rounded-2xl border bg-white p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="font-semibold">{t(`scopes.${scope}`)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(`scopeHints.${scope}`)}
                  </p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="text-xl font-extrabold text-primary">
                    {eur(SPONSOR_PRICES[scope])}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {t("perMonth")}
                  </span>
                </p>
              </div>
              <p className="mt-3 rounded-xl bg-muted/60 px-3 py-2 text-sm">
                {t("perYear")}:{" "}
                <span className="font-semibold">{year(scope)}</span>{" "}
                <span className="text-primary">({t("yearHint")})</span>
              </p>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto rounded-2xl border bg-white sm:block">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-muted/60 text-sm text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <span className="sr-only">{t("sponsoredTitle")}</span>
                </th>
                <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                  {t("perMonth")}
                </th>
                <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                  {t("perYear")}{" "}
                  <span className="text-primary">({t("yearHint")})</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ROWS.map((scope) => (
                <tr key={scope}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{t(`scopes.${scope}`)}</p>
                    <p className="text-sm text-muted-foreground">
                      {t(`scopeHints.${scope}`)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-extrabold whitespace-nowrap text-primary">
                    {eur(SPONSOR_PRICES[scope])}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {year(scope)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {[t("combine")].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <Check
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              {line}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2">
          {contactLinks(t("contactSubject")).map(
            ({ href, label, icon: Icon }) => (
              <a key={label} href={href} className={contactButton}>
                <Icon className="size-4" />
                {tc(label)}
              </a>
            ),
          )}
          <Link
            href="/kako-rangiramo"
            className="px-2 text-sm font-semibold text-primary hover:underline"
          >
            {t("howWeRank")} →
          </Link>
        </div>
      </div>

      <div
        id="baneri"
        className="scroll-mt-24 space-y-4 rounded-2xl border bg-white p-5"
      >
        <div>
          <p className="text-lg font-bold">{tb("title")}</p>
          <p className="mt-1 text-[15px] text-muted-foreground">{tb("text")}</p>
        </div>
        <ul className="divide-y rounded-xl border">
          {(["home", "service", "city"] as const).map((scope) => (
            <li
              key={scope}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3"
            >
              <span>
                <span className="block font-semibold">
                  {tb(`rows.${scope}`)}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {tb(`hints.${scope}`)}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-lg font-extrabold text-primary">
                  {eur(BANNER_PRICES[scope])}{" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    {tb("perMonth")}
                  </span>
                </span>
                <span className="block text-xs text-muted-foreground">
                  {eur(BANNER_PRICES[scope] * SPONSOR_YEAR_MONTHS)}{" "}
                  {tb("perYear")}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <ul className="space-y-1.5 text-sm">
          {(tb.raw("points") as string[]).map((line) => (
            <li key={line} className="flex items-start gap-2">
              <Check
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              {line}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2">
          {contactLinks(tb("contactSubject")).map(
            ({ href, label, icon: Icon }) => (
              <a key={label} href={href} className={contactButton}>
                <Icon className="size-4" />
                {tc(label)}
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
