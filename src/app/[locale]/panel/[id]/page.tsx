import { ArrowLeft, PartyPopper } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SetAlternates } from "@/components/layout/alternates";
import {
  BusinessEditor,
  type EditorBusiness,
} from "@/components/panel/business-editor";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireUser } from "@/lib/auth/session";
import { languageName } from "@/lib/format";
import { tr } from "@/lib/i18n-fields";
import { shortName } from "@/lib/queries/businesses";
import { getOwnedBusiness, listRecentInquiries } from "@/lib/queries/panel";
import { getTaxonomy } from "@/lib/queries/taxonomy";
import { localePaths } from "@/lib/seo/metadata";

const LANGUAGES = [
  "sr-Latn-ME",
  "en",
  "ru",
  "de",
  "it",
  "fr",
  "tr",
  "sq",
  "uk",
];
const UNITS = [
  "hour",
  "m2",
  "piece",
  "job",
  "session",
  "day",
  "month",
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/panel/[id]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Panel",
  });
  return { title: t("edit"), robots: { index: false, follow: false } };
}

export default async function EditBusinessPage({
  params,
  searchParams,
}: PageProps<"/[locale]/panel/[id]">) {
  const { locale: raw, id } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const user = await requireUser(
    locale,
    getPathname({ locale, href: { pathname: "/panel/[id]", params: { id } } }),
  );
  const t = await getTranslations({ locale, namespace: "Panel" });
  const alternates = (
    <SetAlternates
      paths={localePaths({ pathname: "/panel/[id]", params: { id } })}
    />
  );
  const tu = await getTranslations({ locale, namespace: "Units" });
  const tWizard = await getTranslations({ locale, namespace: "Wizard" });
  const tw = await getTranslations({ locale, namespace: "Weekdays" });
  const query = await searchParams;
  const created = query.created === "1";
  const photosFailed = Number(query.photosFailed) || 0;
  const photosTotal = Number(query.photosTotal) || 0;

  const [business, { services, cities }] = await Promise.all([
    getOwnedBusiness(id, user.id),
    getTaxonomy(),
  ]);
  if (!business) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        {alternates}
        <p className="text-muted-foreground">{t("notFound")}</p>
        <Link
          href="/panel"
          className="mt-4 inline-block font-semibold text-primary"
        >
          ← {t("title")}
        </Link>
      </main>
    );
  }

  // Customer requests matching this business (RLS already limits them to the
  // owner's matching businesses; narrow to this one here).
  const areaIds = new Set(
    business.business_cities.flatMap((bc) => {
      const c = cities.find((x) => x.id === bc.city_id);
      return c
        ? [
            c.id,
            ...(c.parent_city_id ? [c.parent_city_id] : []),
            ...cities.filter((x) => x.parent_city_id === c.id).map((x) => x.id),
          ]
        : [];
    }),
  );
  const serviceIds = new Set(
    business.business_services.map((s) => s.service_id),
  );
  const { rows: inquiryRows, reveals } = await listRecentInquiries(business.id);
  const revealed = new Set(reveals);
  const inquiries = inquiryRows
    .filter((i) =>
      i.business_id
        ? i.business_id === business.id
        : serviceIds.has(i.service_id) && areaIds.has(i.city_id),
    )
    .map((i) => ({
      id: i.id,
      service: tr(
        services.find((s) => s.id === i.service_id)!,
        "name",
        locale,
      ),
      city: tr(
        cities.find((c) => c.id === i.city_id)!,
        "name",
        locale,
      ),
      body: i.body,
      urgent: i.urgent,
      when: i.preferred_time,
      createdAt: i.created_at,
      direct: i.business_id != null,
      revealed: revealed.has(i.id),
    }));

  const primary = business.business_services
    .filter((s) => s.is_primary)
    .map((s) => s.service_id);
  const editorBusiness: EditorBusiness = {
    id: business.id,
    slug: business.slug,
    name: business.name,
    description: business.description,
    phone: business.phone,
    viber: business.viber,
    whatsapp: business.whatsapp,
    email: business.email,
    website: business.website,
    instagram: business.instagram,
    address: business.address,
    cityId: business.city_id,
    online: business.offers_online,
    emergency: business.emergency_24h,
    languages: business.languages,
    primaryServiceIds: primary,
    otherServiceIds: business.business_services
      .filter((s) => !s.is_primary)
      .map((s) => s.service_id),
    cityIds: business.business_cities.map((c) => c.city_id),
    hours: business.business_hours.map((h) => ({
      weekday: h.weekday,
      opensAt: h.opens_at,
      closesAt: h.closes_at,
    })),
    prices: business.price_list_items.map((p) => ({
      name: p.name,
      kind: p.kind,
      priceFrom: p.price_from == null ? null : Number(p.price_from),
      priceTo: p.price_to == null ? null : Number(p.price_to),
      unit: p.unit,
      serviceId: p.service_id,
    })),
    photos: business.business_photos.map((p) => ({
      id: p.id,
      url: p.url,
      isCover: p.is_cover,
    })),
    inquiries,
    reviews: business.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      hidden: r.status !== "published",
      createdAt: r.created_at,
      author: shortName(r.profiles?.full_name),
      reply: r.reply_body,
    })),
  };

  const norm = (s: string) =>
    s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "dj");

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {alternates}
      <Link
        href="/panel"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("title")}
      </Link>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {business.name}
        </h1>
        <Link
          href={{ pathname: "/b/[slug]", params: { slug: business.slug } }}
          className="inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold hover:bg-muted"
        >
          {t("view")}
        </Link>
      </header>
      {business.moderation_note && business.status !== "active" && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          {t("moderationNote", { note: business.moderation_note })}
        </p>
      )}
      {created && (
        <p className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground">
          <PartyPopper className="size-5 shrink-0" aria-hidden />
          {t("created")}
        </p>
      )}
      {created && photosFailed > 0 && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
        >
          {tWizard("errors.photosFailed", {
            failed: photosFailed,
            total: Math.max(photosTotal, photosFailed),
          })}
        </p>
      )}
      <BusinessEditor
        business={editorBusiness}
        options={{
          services: services.map((s) => ({
            id: s.id,
            name: tr(s, "name", locale),
            search: norm(`${s.name_me} ${s.name_en} ${s.name_ru}`),
          })),
          cities: [...cities]
            .sort(
              (a, b) =>
                (a.parent_city_id ?? a.id) - (b.parent_city_id ?? b.id) ||
                Number(a.parent_city_id != null) -
                  Number(b.parent_city_id != null),
            )
            .map((c) => ({
              id: c.id,
              name: tr(c, "name", locale),
              parentId: c.parent_city_id,
            })),
          weekdays: [1, 2, 3, 4, 5, 6, 7].map((d) => tw(String(d) as "1")),
          units: Object.fromEntries(UNITS.map((u) => [u, tu(u)])) as Record<
            (typeof UNITS)[number],
            string
          >,
          languages: LANGUAGES.map((code) => ({
            code,
            name: languageName(code, locale),
          })),
        }}
      />
    </main>
  );
}
