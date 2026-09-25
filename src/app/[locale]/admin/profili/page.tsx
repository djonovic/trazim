import { setRequestLocale } from "next-intl/server";
import { moderateBusiness } from "@/app/actions/admin";
import { ActionButton } from "@/components/admin/action-button";
import {
  FilterTabs,
  formatDate,
  Pager,
  StatusBadges,
} from "@/components/admin/ui";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import {
  getAdminCounts,
  listAdminBusinesses,
  type AdminBusinessFilter,
} from "@/lib/queries/admin";
import { nameMaps } from "@/lib/queries/taxonomy";

export const metadata = { title: "Profili" };

const FILTERS: { value: AdminBusinessFilter; label: string }[] = [
  { value: "pending", label: "Na provjeri" },
  { value: "all", label: "Svi" },
  { value: "verified", label: "Provjereni" },
  { value: "hidden", label: "Odbijeni i suspendovani" },
];

export default async function AdminBusinesses({
  params,
  searchParams,
}: PageProps<"/[locale]/admin/profili">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const sp = await searchParams;
  const filter = (
    FILTERS.some((f) => f.value === sp.filter) ? sp.filter : "pending"
  ) as AdminBusinessFilter;
  const q = typeof sp.q === "string" ? sp.q : "";
  const page = Number(sp.page) || 1;

  const [{ rows, total, pages }, counts, { cityNames }] = await Promise.all([
    listAdminBusinesses({ filter, q, page }),
    getAdminCounts(),
    nameMaps("sr-Latn-ME"),
  ]);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Profili</h1>
        <form className="flex gap-2" role="search">
          <input type="hidden" name="filter" value={filter} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Naziv, slug ili telefon"
            className="h-10 w-64 rounded-full border bg-white px-4 text-sm outline-none focus:border-primary"
          />
          <button className="h-10 rounded-full border bg-white px-4 text-sm font-semibold hover:bg-muted">
            Traži
          </button>
        </form>
      </header>
      <FilterTabs
        pathname="/admin/profili"
        current={filter}
        query={q ? { q } : {}}
        options={FILTERS.map((f) => ({
          ...f,
          count: f.value === "pending" ? counts.pending : undefined,
        }))}
      />
      <p className="text-sm text-muted-foreground">{total} rezultata</p>
      {rows.length ? (
        <ul className="divide-y rounded-2xl border bg-white">
          {rows.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={{
                    pathname: "/admin/profili/[id]",
                    params: { id: b.id },
                  }}
                  className="font-semibold hover:underline"
                >
                  {b.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {cityNames[b.city_id]} · {formatDate(b.created_at)} ·{" "}
                  {b.phone ?? "bez telefona"} · {b.rating_count} recenzija
                </p>
              </div>
              <StatusBadges
                status={b.status}
                moderatedAt={b.moderated_at}
                verifiedAt={b.verified_at}
              />
              {b.status === "active" && !b.moderated_at && (
                <ActionButton
                  action={moderateBusiness.bind(null, b.id, "approve")}
                  label="Odobri"
                  variant="primary"
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          {filter === "pending"
            ? "Svi profili su pregledani. 🎉"
            : "Nema profila."}
        </p>
      )}
      <Pager
        pathname="/admin/profili"
        page={page}
        pages={pages}
        query={{ filter, ...(q ? { q } : {}) }}
      />
    </div>
  );
}
