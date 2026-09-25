import { Mail, Phone, Plus, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SearchTrigger } from "@/components/search/search-dialog";
import { Link } from "@/i18n/navigation";
import { UserMenu } from "@/components/auth/user-menu";
import { SITE } from "@/lib/site";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { MobileSearchButton } from "./mobile-search-button";

export async function SiteHeader() {
  const t = await getTranslations("Common");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="border-b bg-muted/60">
        <div className="mx-auto flex h-9 max-w-6xl items-center gap-4 px-4 text-xs">
          <Link
            href="/za-biznise"
            className="mr-auto inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <Plus className="size-3.5" aria-hidden />
            {t("addBusiness")}
          </Link>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary"
          >
            <Phone className="size-3.5" aria-hidden />
            {SITE.phoneDisplay}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Mail className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">{SITE.email}</span>
            <span className="sm:hidden">Email</span>
          </a>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" aria-label={t("siteName")} className="shrink-0">
          <Logo />
        </Link>
        <SearchTrigger
          label={t("search")}
          className="ml-4 hidden w-72 md:flex"
        />
        <div className="ml-auto flex items-center gap-2">
          <MobileSearchButton label={t("search")}>
            <Search className="size-5" />
          </MobileSearchButton>
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
