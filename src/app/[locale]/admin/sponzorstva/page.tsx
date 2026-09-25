import { setRequestLocale } from "next-intl/server";
import { setSponsorshipStatus } from "@/app/actions/admin";
import { ActionButton } from "@/components/admin/action-button";
import { SponsorshipForm } from "@/components/admin/sponsorship-form";
import {
  SponsorshipOrder,
  type OrderItem,
} from "@/components/admin/sponsorship-order";
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

  // Running or upcoming sponsorships per placement, in the order the site
  // shows them (see listSponsored): position first, then oldest first.
  const groups = new Map<string, { title: string; rows: typeof rows }>();
  for (const s of rows) {
    if (s.status !== "active" || s.ends_at < now || !s.business) continue;
    const key = `${s.scope}:${s.service_id ?? ""}:${s.city_id ?? ""}`;
    const title = [
      SCOPES[s.scope],
      s.service_id && serviceNames[s.service_id],
      s.city_id && cityNames[s.city_id],
    ]
      .filter(Boolean)
      .join(" · ");
    const group = groups.get(key) ?? { title, rows: [] };
    group.rows.push(s);
    groups.set(key, group);
  }
  const orderable = [...groups.entries()]
    .filter(([, g]) => g.rows.length > 1)
    .map(([key, g]) => ({
      key,
      title: g.title,
      items: g.rows
        .sort(
          (a, b) =>
            (a.position ?? Infinity) - (b.position ?? Infinity) ||
            a.starts_at.localeCompare(b.starts_at),
        )
        .map((s): OrderItem => ({
          id: s.id,
          name: s.business!.name,
          detail:
            s.starts_at <= now
              ? `Aktivno do ${formatDate(s.ends_at)}`
              : `Počinje ${formatDate(s.starts_at)}`,
        })),
    }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Sponzorstva</h1>
        <p className="text-muted-foreground">
          Ručni unos dok nema online plaćanja. Prikazuje se kao „Sponzorisano”
          na vrhu liste.
        </p>
      </header>
      {orderable.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-bold">Redoslijed</h2>
            <p className="text-sm text-muted-foreground">
              Ovim redom se sponzori prikazuju na svakoj poziciji. Novo
              sponzorstvo ide na kraj dok ga ne pomjeriš.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {orderable.map((g) => (
              <SponsorshipOrder
                key={`${g.key}:${g.items.map((i) => i.id).join(",")}`}
                title={g.title}
                items={g.items}
              />
            ))}
          </div>
        </section>
      )}
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
