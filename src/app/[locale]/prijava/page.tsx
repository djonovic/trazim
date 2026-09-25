import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConfirmLink } from "@/components/auth/confirm-link";
import { LoginForm } from "@/components/auth/login-form";
import { SetAlternates } from "@/components/layout/alternates";
import type { Locale } from "@/i18n/routing";
import { safeNext } from "@/lib/auth/redirect";
import { getUser } from "@/lib/auth/session";
import { translatePath } from "@/lib/i18n-path";
import { localePaths } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/prijava">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Auth",
  });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function LoginPage({
  params,
  searchParams,
}: PageProps<"/[locale]/prijava">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const query = await searchParams;
  const next = safeNext(
    typeof query.next === "string" ? query.next : undefined,
  );
  const tokenHash =
    typeof query.token_hash === "string" ? query.token_hash : undefined;
  const otpType = typeof query.type === "string" ? query.type : undefined;
  if (await getUser()) redirect(next);
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Auth",
  });

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-12">
      <SetAlternates
        paths={localePaths((target) => ({
          pathname: "/prijava",
          // After switching language, land on the page in the new language.
          query:
            typeof query.next === "string"
              ? { next: translatePath(next, target) ?? next }
              : {},
        }))}
      />
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {tokenHash ? t("confirmTitle") : t("title")}
        </h1>
        {!tokenHash && <p className="text-muted-foreground">{t("subtitle")}</p>}
      </header>
      {query.error === "callback" && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {t("callbackError")}
        </p>
      )}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {tokenHash && otpType ? (
          <ConfirmLink
            locale={locale as Locale}
            tokenHash={tokenHash}
            type={otpType}
            next={next}
          />
        ) : (
          <LoginForm next={next} />
        )}
      </div>
    </main>
  );
}
