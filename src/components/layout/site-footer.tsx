import { getTranslations } from "next-intl/server";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";

type Href = ComponentProps<typeof Link>["href"];

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  const columns: { title: string; links: [string, Href][] }[] = [
    {
      title: t("forUsers"),
      links: [
        [t("services"), "/usluge"],
        [t("cities"), "/gradovi"],
        [t("prices"), "/cijene"],
        [t("statistics"), "/statistika"],
      ],
    },
    {
      title: t("forBusiness"),
      links: [
        [t("addBusiness"), "/za-biznise"],
        [t("howWeRank"), "/kako-rangiramo"],
      ],
    },
    {
      title: t("help"),
      links: [
        [t("howItWorks"), "/kako-funkcionise"],
        [t("helpCenter"), "/pomoc"],
        [t("safety"), "/bezbjednost"],
        [t("contact"), "/kontakt"],
        [t("about"), "/o-nama"],
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t bg-muted/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("tagline")}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-3 text-sm font-semibold">{col.title}</h2>
            <ul className="space-y-2 text-sm">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-5 text-xs text-muted-foreground">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
          <Link href="/uslovi" className="hover:text-foreground">
            {t("terms")}
          </Link>
          <Link href="/privatnost" className="hover:text-foreground">
            {t("privacy")}
          </Link>
          <Link href="/kolacici" className="hover:text-foreground">
            {t("cookies")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
