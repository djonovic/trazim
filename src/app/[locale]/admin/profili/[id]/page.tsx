import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { moderateBusiness, setSponsorshipStatus } from "@/app/actions/admin";
import { ActionButton } from "@/components/admin/action-button";
import {
  ACTIONS,
  Badge,
  formatDate,
  formatDateTime,
  REPORT_REASONS,
  SCOPES,
  StatusBadges,
} from "@/components/admin/ui";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminBusiness } from "@/lib/queries/admin";
import { nameMaps } from "@/lib/queries/taxonomy";

export const metadata = { title: "Profil" };

export default async function AdminBusiness({
  params,
}: PageProps<"/[locale]/admin/profili/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const [b, { cityNames, serviceNames }] = await Promise.all([
    getAdminBusiness(id),
    nameMaps("sr-Latn-ME"),
  ]);
  if (!b) notFound();

  const act = (action: Parameters<typeof moderateBusiness>[1]) =>
    moderateBusiness.bind(null, b.id, action);
  const hidden = b.status === "rejected" || b.status === "suspended";

  const details: [string, React.ReactNode][] = [
    ["Telefon", b.phone],
    ["Viber", b.viber],
    ["WhatsApp", b.whatsapp],
    ["Email", b.email],
    [
      "Sajt",
      b.website && (
        <a
          href={b.website}
          target="_blank"
          rel="noopener"
          className="text-primary hover:underline"
        >
          {b.website}
        </a>
      ),
    ],
    ["Instagram", b.instagram],
    ["Adresa", b.address],
    ["Glavni grad", cityNames[b.city_id]],
    [
      "Zona rada",
      b.business_cities.map((c) => cityNames[c.city_id]).join(", "),
    ],
    [
      "Usluge",
      b.business_services
        .map((s) => `${serviceNames[s.service_id]}${s.is_primary ? " ★" : ""}`)
        .join(", "),
    ],
    [
      "Vlasnik",
      [b.owner?.full_name, b.ownerEmail].filter(Boolean).join(" · ") || "—",
    ],
    ["Kreiran", formatDateTime(b.created_at)],
    ["Pregledan", b.moderated_at ? formatDateTime(b.moderated_at) : "—"],
    ["Provjeren", b.verified_at ? formatDateTime(b.verified_at) : "—"],
    [
      "Ocjena",
      `${Number(b.rating_avg).toFixed(1)} (${b.rating_count}) · ${b.reviewCount} recenzija ukupno`,
    ],
    ["Pregledi", b.views_count],
  ];

  return (
    <div className="space-y-8">
      <Link
        href="/admin/profili"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Profili
      </Link>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">{b.name}</h1>
          <StatusBadges
            status={b.status}
            moderatedAt={b.moderated_at}
            verifiedAt={b.verified_at}
          />
        </div>
        {b.status === "active" && (
          <Link
            href={{ pathname: "/b/[slug]", params: { slug: b.slug } }}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            /b/{b.slug} <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        )}
        {b.moderation_note && (
          <p className="rounded-xl bg-muted px-3 py-2 text-sm">
            Poruka vlasniku: {b.moderation_note}
          </p>
        )}
      </header>

      <section className="flex flex-wrap items-start gap-2">
        {b.status === "active" && !b.moderated_at && (
          <ActionButton
            action={act("approve")}
            label="Odobri"
            variant="primary"
          />
        )}
        {b.verified_at ? (
          <ActionButton
            action={act("unverify")}
            label="Skini „Provjeren”"
            confirm="Skinuti oznaku Provjeren?"
          />
        ) : (
          !hidden && (
            <ActionButton
              action={act("verify")}
              label="Označi kao provjeren"
              confirm="Da li si provjerio PIB/CRPS i broj telefona?"
            />
          )
        )}
        {hidden ? (
          <ActionButton
            action={act("restore")}
            label="Vrati profil"
            confirm="Vratiti profil na sajt?"
          />
        ) : (
          <>
            {!b.moderated_at && (
              <ActionButton
                action={act("reject")}
                label="Odbij"
                variant="danger"
                note="Razlog (vlasnik ga vidi u panelu)"
                noteRequired
              />
            )}
            <ActionButton
              action={act("suspend")}
              label="Suspenduj"
              variant="danger"
              note="Razlog (vlasnik ga vidi u panelu)"
              noteRequired
            />
          </>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <dl className="grid gap-x-6 gap-y-2 rounded-2xl border bg-white p-4 text-sm sm:grid-cols-[140px_minmax(0,1fr)]">
            {details.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="break-words">{value || "—"}</dd>
              </div>
            ))}
          </dl>
          {b.description && (
            <section className="space-y-2">
              <h2 className="font-bold">Opis</h2>
              <p className="text-sm whitespace-pre-line">{b.description}</p>
            </section>
          )}
          {b.photos.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-bold">Slike ({b.photos.length})</h2>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {b.photos.map((p) => (
                  <li
                    key={p.id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={p.url}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <section className="space-y-2">
            <h2 className="font-bold">Prijave ({b.reports.length})</h2>
            {b.reports.length ? (
              <ul className="space-y-2 text-sm">
                {b.reports.map((r) => (
                  <li key={r.id} className="rounded-xl border bg-white p-3">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {REPORT_REASONS[r.reason]}
                      </span>
                      <Badge tone={r.status === "open" ? "warn" : "neutral"}>
                        {r.status === "open"
                          ? "otvorena"
                          : r.status === "resolved"
                            ? "riješena"
                            : "odbačena"}
                      </Badge>
                      {r.target === "review" && <Badge>recenzija</Badge>}
                    </p>
                    {r.details && (
                      <p className="mt-1 text-muted-foreground">{r.details}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(r.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nema prijava.</p>
            )}
          </section>
          <section className="space-y-2">
            <h2 className="font-bold">Sponzorstva</h2>
            {b.sponsorships.length ? (
              <ul className="space-y-2 text-sm">
                {b.sponsorships.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white p-3"
                  >
                    <span>
                      {SCOPES[s.scope]}
                      {s.service_id && ` · ${serviceNames[s.service_id]}`}
                      {s.city_id && ` · ${cityNames[s.city_id]}`}
                      <span className="block text-xs text-muted-foreground">
                        {formatDate(s.starts_at)} – {formatDate(s.ends_at)} ·{" "}
                        {s.status}
                      </span>
                    </span>
                    {s.status === "active" && (
                      <ActionButton
                        action={setSponsorshipStatus.bind(
                          null,
                          s.id,
                          "cancelled",
                        )}
                        label="Otkaži"
                        variant="danger"
                        confirm="Otkazati sponzorstvo?"
                      />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nema.{" "}
                <Link
                  href="/admin/sponzorstva"
                  className="text-primary hover:underline"
                >
                  Dodaj
                </Link>
              </p>
            )}
          </section>
          <section className="space-y-2">
            <h2 className="font-bold">Istorija</h2>
            {b.log.length ? (
              <ul className="space-y-1.5 text-sm">
                {b.log.map((l) => (
                  <li key={l.id}>
                    <span className="text-muted-foreground tabular-nums">
                      {formatDateTime(l.created_at)}
                    </span>{" "}
                    {ACTIONS[l.action] ?? l.action}
                    {l.note && (
                      <span className="text-muted-foreground"> „{l.note}”</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      · {l.admin?.full_name ?? "admin"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nema akcija.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
