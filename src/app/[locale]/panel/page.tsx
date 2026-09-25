import { BadgeCheck, Eye, MousePointerClick, Plus } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Rating } from "@/components/business/rating";
import { SetAlternates } from "@/components/layout/alternates";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireUser } from "@/lib/auth/session";
import { tr } from "@/lib/i18n-fields";
import { getMyBusinesses } from "@/lib/queries/panel";
import { getTaxonomy } from "@/lib/queries/taxonomy";
import { localePaths } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/panel">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Panel",
  });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function PanelPage({
  params,
}: PageProps<"/[locale]/panel">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const user = await requireUser(
    locale,
    getPathname({ locale, href: "/panel" }),
  );
  const t = await getTranslations({ locale, namespace: "Panel" });
  const [businesses, { cities }] = await Promise.all([
    getMyBusinesses(user.id),
    getTaxonomy(),
  ]);
  const statusLabel = {
    active: t("statusActive"),
    pending: t("statusPending"),
    rejected: t("statusRejected"),
    suspended: t("statusSuspended"),
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <SetAlternates paths={localePaths("/panel")} />
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
        <Link
          href="/panel/novi"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground"
        >
          <Plus className="size-4" aria-hidden />
          {t("new")}
        </Link>
      </header>

      {businesses.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {businesses.map((b) => (
            <li
              key={b.id}
              className="space-y-4 rounded-2xl border bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold">
                    {b.name}
                    {b.verified_at && (
                      <BadgeCheck
                        className="ml-1 inline size-4 text-primary"
                        aria-label={t("verified")}
                      />
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {tr(
                      cities.find((c) => c.id === b.city_id)!,
                      "name",
                      locale,
                    )}{" "}
                    · {statusLabel[b.status]}
                    {b.status === "active" &&
                      !b.moderated_at &&
                      ` · ${t("underReview")}`}
                  </p>
                  <Rating value={Number(b.rating_avg)} count={b.rating_count} />
                </div>
                <div className="flex gap-2">
                  <Link
                    href={{ pathname: "/b/[slug]", params: { slug: b.slug } }}
                    className="inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold hover:bg-muted"
                  >
                    {t("view")}
                  </Link>
                  <Link
                    href={{ pathname: "/panel/[id]", params: { id: b.id } }}
                    className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
                  >
                    {t("edit")}
                  </Link>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/60 p-3">
                  <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Eye className="size-4" aria-hidden />
                    {t("statsViews")}
                  </dt>
                  <dd className="text-2xl font-bold tabular-nums">
                    {b.views30}
                  </dd>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MousePointerClick className="size-4" aria-hidden />
                    {t("statsContacts")}
                  </dt>
                  <dd className="text-2xl font-bold tabular-nums">
                    {b.contacts30}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
