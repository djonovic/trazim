import { setRequestLocale } from "next-intl/server";
import { setBannerStatus } from "@/app/actions/admin";
import { ActionButton } from "@/components/admin/action-button";
import { BannerForm } from "@/components/admin/banner-form";
import { Badge, formatDate } from "@/components/admin/ui";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import { listAdminBanners } from "@/lib/queries/admin";
import { getTaxonomy, nameMaps } from "@/lib/queries/taxonomy";

export const metadata = { title: "Baneri" };

export default async function AdminBanners({
  params,
}: PageProps<"/[locale]/admin/baneri">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const [rows, { services, cities }, { serviceNames, cityNames }] =
    await Promise.all([
      listAdminBanners(),
      getTaxonomy(),
      nameMaps("sr-Latn-ME"),
    ]);
  const now = new Date().toISOString();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Baneri</h1>
        <p className="text-muted-foreground">
          Baner je u desnom stubcu i vidljiv je dok se skroluje (na telefonu
          traka pri dnu). Prazna mjesta nude „Pogledaj ponudu”.
        </p>
      </header>
      <BannerForm
        services={services
          .map((s) => ({ id: s.id, name: s.name_me }))
          .sort((a, b) => a.name.localeCompare(b.name, "sr"))}
        cities={cities
          .map((c) => ({ id: c.id, name: c.name_me }))
          .sort((a, b) => a.name.localeCompare(b.name, "sr"))}
      />
      {rows.length ? (
        <ul className="divide-y rounded-2xl border bg-white">
          {rows.map((b) => {
            const live =
              b.status === "active" && b.starts_at <= now && b.ends_at >= now;
            const expired = b.ends_at < now;
            return (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
              >
                <span
                  className="size-8 shrink-0 rounded-lg"
                  style={{ backgroundColor: b.color }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold">
                    {b.advertiser}: {b.title}
                  </p>
                  <p className="text-muted-foreground">
                    {b.scope === "home"
                      ? "Početna"
                      : b.scope === "city"
                        ? `Grad: ${cityNames[b.city_id!]}`
                        : serviceNames[b.service_id!]}{" "}
                    · {formatDate(b.starts_at)} – {formatDate(b.ends_at)} ·{" "}
                    {b.clicks} klikova
                    {b.payment_ref && ` · ${b.payment_ref}`}
                  </p>
                </div>
                {live ? (
                  <Badge tone="good">Aktivan</Badge>
                ) : expired ? (
                  <Badge>Istekao</Badge>
                ) : b.status === "active" ? (
                  <Badge tone="warn">Počinje {formatDate(b.starts_at)}</Badge>
                ) : (
                  <Badge tone={b.status === "cancelled" ? "bad" : "neutral"}>
                    {b.status === "paused" ? "Pauziran" : "Otkazan"}
                  </Badge>
                )}
                {!expired && b.status === "active" && (
                  <ActionButton
                    action={setBannerStatus.bind(null, b.id, "paused")}
                    label="Pauziraj"
                  />
                )}
                {!expired && b.status === "paused" && (
                  <ActionButton
                    action={setBannerStatus.bind(null, b.id, "active")}
                    label="Nastavi"
                  />
                )}
                {!expired && b.status !== "cancelled" && (
                  <ActionButton
                    action={setBannerStatus.bind(null, b.id, "cancelled")}
                    label="Otkaži"
                    variant="danger"
                    confirm="Otkazati baner?"
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          Još nema banera.
        </p>
      )}
    </div>
  );
}
