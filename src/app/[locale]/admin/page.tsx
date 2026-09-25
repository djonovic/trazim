import { setRequestLocale } from "next-intl/server";
import { ACTIONS, formatDateTime } from "@/components/admin/ui";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminCounts, listAdminLog } from "@/lib/queries/admin";

export const metadata = { title: "Pregled" };

export default async function AdminHome({
  params,
}: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const [counts, log] = await Promise.all([getAdminCounts(), listAdminLog()]);

  const cards = [
    {
      label: "Profili na provjeri",
      value: counts.pending,
      href: "/admin/profili" as const,
      urgent: counts.pending > 0,
    },
    {
      label: "Otvorene prijave",
      value: counts.reports,
      href: "/admin/prijave" as const,
      urgent: counts.reports > 0,
    },
    {
      label: "Recenzije (7 dana)",
      value: counts.reviews,
      href: "/admin/recenzije" as const,
    },
    {
      label: "Aktivna sponzorstva",
      value: counts.sponsorships,
      href: "/admin/sponzorstva" as const,
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin</h1>
        <p className="text-muted-foreground">
          {counts.businesses} biznisa · {counts.users} korisnika
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className="block space-y-1 rounded-2xl border bg-white p-4 hover:bg-muted"
            >
              <span
                className={
                  c.urgent
                    ? "text-3xl font-extrabold text-destructive tabular-nums"
                    : "text-3xl font-extrabold tabular-nums"
                }
              >
                {c.value}
              </span>
              <span className="block text-sm text-muted-foreground">
                {c.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Posljednje akcije</h2>
        {log.length ? (
          <ul className="divide-y rounded-2xl border bg-white text-sm">
            {log.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5"
              >
                <span className="text-muted-foreground tabular-nums">
                  {formatDateTime(entry.created_at)}
                </span>
                <span className="font-medium">
                  {ACTIONS[entry.action] ?? entry.action}
                </span>
                {entry.business && (
                  <Link
                    href={{
                      pathname: "/admin/profili/[id]",
                      params: { id: entry.business.id },
                    }}
                    className="text-primary hover:underline"
                  >
                    {entry.business.name}
                  </Link>
                )}
                {entry.note && (
                  <span className="text-muted-foreground">„{entry.note}”</span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  {entry.admin?.full_name ?? "admin"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Još nema akcija.</p>
        )}
      </section>
    </div>
  );
}
