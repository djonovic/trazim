import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NameForm } from "@/components/auth/name-form";
import { SetAlternates } from "@/components/layout/alternates";
import { Stars } from "@/components/business/review-list";
import { CloseInquiryButton } from "@/components/inquiries/close-inquiry-button";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireUser } from "@/lib/auth/session";
import { tr } from "@/lib/i18n-fields";
import { getTaxonomy } from "@/lib/queries/taxonomy";
import { localePaths } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/moj-nalog">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Account",
  });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AccountPage({
  params,
}: PageProps<"/[locale]/moj-nalog">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const user = await requireUser(
    locale,
    getPathname({ locale, href: "/moj-nalog" }),
  );
  const t = await getTranslations({ locale, namespace: "Account" });

  const supabase = await createClient();
  const [
    { data: profile },
    { data: businesses },
    { data: reviews },
    { data: inquiries },
    { services, cities },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("businesses")
      .select("id, name, slug")
      .eq("owner_id", user.id)
      .order("created_at"),
    supabase
      .from("reviews")
      .select("id, rating, body, businesses!inner(name, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("inquiries")
      .select(
        "id, service_id, city_id, body, status, created_at, inquiry_reveals(business_id)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    getTaxonomy(),
  ]);
  const ti = await getTranslations({ locale, namespace: "Inquiry" });

  return (
    <main className="mx-auto max-w-xl space-y-10 px-4 py-10">
      <SetAlternates paths={localePaths("/moj-nalog")} />
      <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
      <section className="space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <p className="text-sm text-muted-foreground">{t("email")}</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <NameForm initial={profile?.full_name ?? ""} />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t("businesses")}</h2>
        {businesses?.length ? (
          <ul className="divide-y rounded-2xl border bg-white">
            {businesses.map((b) => (
              <li key={b.id}>
                <Link
                  href={{ pathname: "/panel/[id]", params: { id: b.id } }}
                  className="flex items-center justify-between px-4 py-3 font-medium hover:bg-muted"
                >
                  {b.name} <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{t("noBusinesses")}</p>
        )}
        <Link
          href="/panel/novi"
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 font-semibold text-primary-foreground"
        >
          {t("addBusiness")}
        </Link>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{ti("myInquiries")}</h2>
        {inquiries?.length ? (
          <ul className="divide-y rounded-2xl border bg-white">
            {inquiries.map((i) => {
              const service = services.find((s) => s.id === i.service_id);
              const city = cities.find((c) => c.id === i.city_id);
              return (
                <li key={i.id} className="space-y-1 px-4 py-3">
                  <p className="flex flex-wrap items-center justify-between gap-2 font-medium">
                    <span>
                      {service && tr(service, "name", locale)}
                      {city && ` · ${tr(city, "name", locale)}`}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {i.status === "approved"
                        ? ti("active")
                        : i.status === "rejected"
                          ? ti("rejected")
                          : ti("closed")}
                    </span>
                  </p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {i.body}
                  </p>
                  {i.status === "approved" && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="text-primary">
                        {ti("opened", { count: i.inquiry_reveals.length })}
                      </span>
                      <CloseInquiryButton inquiryId={i.id} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground">{ti("noInquiries")}</p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t("reviews")}</h2>
        {reviews?.length ? (
          <ul className="divide-y rounded-2xl border bg-white">
            {reviews.map((r) => (
              <li key={r.id}>
                <Link
                  href={{
                    pathname: "/b/[slug]",
                    params: { slug: r.businesses.slug },
                  }}
                  className="block space-y-1 px-4 py-3 hover:bg-muted"
                >
                  <span className="flex items-center justify-between gap-3 font-medium">
                    {r.businesses.name}
                    <Stars value={r.rating} />
                  </span>
                  {r.body && (
                    <span className="line-clamp-2 text-sm text-muted-foreground">
                      {r.body}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{t("noReviews")}</p>
        )}
      </section>
    </main>
  );
}
