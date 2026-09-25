import { setRequestLocale } from "next-intl/server";
import { setSponsorshipStatus } from "@/app/actions/admin";
import { ActionButton } from "@/components/admin/action-button";
import { SponsorshipForm } from "@/components/admin/sponsorship-form";
import { Badge, formatDate, SCOPES } from "@/components/admin/ui";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import { listAdminSponsorships } from "@/lib/queries/admin";
import { getTaxonomy, nameMaps } from "@/lib/queries/taxonomy";

export const metadata = { title: "Sponzorstva" };

export default async function AdminSponsorships({
  params,
}: PageProps<"/[locale]/admin/sponzorstva">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const [rows, { services, cities }, { cityNames, serviceNames }] =
    await Promise.all([
      listAdminSponsorships(),
      getTaxonomy(),
      nameMaps("sr-Latn-ME"),
    ]);
  const now = new Date().toISOString();
  const byName = (a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name, "sr");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Sponzorstva</h1>
        <p className="text-muted-foreground">
          Ručni unos dok nema online plaćanja. Prikazuje se kao „Sponzorisano”
          na vrhu liste.
        </p>
      </header>
      <SponsorshipForm
        services={services
          .map((s) => ({ id: s.id, name: s.name_me }))
          .sort(byName)}
        cities={cities.map((c) => ({ id: c.id, name: c.name_me })).sort(byName)}
      />
      {rows.length ? (
        <ul className="divide-y rounded-2xl border bg-white">
          {rows.map((s) => {
            const live =
              s.status === "active" && s.starts_at <= now && s.ends_at >= now;
            const expired = s.ends_at < now;
            return (
              <li
                key={s.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
              >
                <div className="min-w-0 flex-1 text-sm">
                  {s.business && (
                    <Link
                      href={{
                        pathname: "/admin/profili/[id]",
                        params: { id: s.business.id },
                      }}
                      className="font-semibold hover:underline"
                    >
                      {s.business.name}
                    </Link>
                  )}
                  <p className="text-muted-foreground">
                    {SCOPES[s.scope]}
                    {s.service_id && ` · ${serviceNames[s.service_id]}`}
                    {s.city_id && ` · ${cityNames[s.city_id]}`} ·{" "}
                    {formatDate(s.starts_at)} – {formatDate(s.ends_at)}
                    {s.payment_ref && ` · ${s.payment_ref}`}
                  </p>
                </div>
                {live ? (
                  <Badge tone="good">Aktivno</Badge>
                ) : expired ? (
                  <Badge>Isteklo</Badge>
                ) : s.status === "active" ? (
                  <Badge tone="warn">Počinje {formatDate(s.starts_at)}</Badge>
                ) : (
                  <Badge tone={s.status === "cancelled" ? "bad" : "neutral"}>
                    {s.status === "paused" ? "Pauzirano" : "Otkazano"}
                  </Badge>
                )}
                {!expired && s.status === "active" && (
                  <ActionButton
                    action={setSponsorshipStatus.bind(null, s.id, "paused")}
                    label="Pauziraj"
                  />
                )}
                {!expired && s.status === "paused" && (
                  <ActionButton
                    action={setSponsorshipStatus.bind(null, s.id, "active")}
                    label="Nastavi"
                  />
                )}
                {!expired && s.status !== "cancelled" && (
                  <ActionButton
                    action={setSponsorshipStatus.bind(null, s.id, "cancelled")}
                    label="Otkaži"
                    variant="danger"
                    confirm="Otkazati sponzorstvo?"
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          Još nema sponzorstava.
        </p>
      )}
    </div>
  );
}
