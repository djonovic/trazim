import { setRequestLocale } from "next-intl/server";
import { moderateReview } from "@/app/actions/admin";
import { ActionButton } from "@/components/admin/action-button";
import {
  Badge,
  FilterTabs,
  formatDateTime,
  Pager,
} from "@/components/admin/ui";
import { Stars } from "@/components/business/review-list";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import { listAdminReviews, type AdminReviewFilter } from "@/lib/queries/admin";

export const metadata = { title: "Recenzije" };

const FILTERS: { value: AdminReviewFilter; label: string }[] = [
  { value: "published", label: "Objavljene" },
  { value: "hidden", label: "Sakrivene" },
  { value: "all", label: "Sve" },
];

export default async function AdminReviews({
  params,
  searchParams,
}: PageProps<"/[locale]/admin/recenzije">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const sp = await searchParams;
  const filter = (
    FILTERS.some((f) => f.value === sp.filter) ? sp.filter : "published"
  ) as AdminReviewFilter;
  const page = Number(sp.page) || 1;
  const { rows, total, pages } = await listAdminReviews({ filter, page });

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold tracking-tight">Recenzije</h1>
      <FilterTabs
        pathname="/admin/recenzije"
        current={filter}
        options={FILTERS}
      />
      <p className="text-sm text-muted-foreground">{total} recenzija</p>
      {rows.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="space-y-2 rounded-2xl border bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  {r.business && (
                    <Link
                      href={{
                        pathname: "/admin/profili/[id]",
                        params: { id: r.business.id },
                      }}
                      className="font-semibold text-primary hover:underline"
                    >
                      {r.business.name}
                    </Link>
                  )}
                  <p className="text-muted-foreground">
                    {r.author?.full_name ?? "Korisnik"} ·{" "}
                    {formatDateTime(r.created_at)}
                    {r.edited_at && " · izmijenjena"}
                  </p>
                </div>
                <Stars value={r.rating} />
              </div>
              {r.status !== "published" && (
                <Badge tone="bad">
                  {r.status === "hidden" ? "Sakrivena" : "Uklonjena"}
                </Badge>
              )}
              {r.body && (
                <p className="text-[15px] whitespace-pre-line">{r.body}</p>
              )}
              {r.reply_body && (
                <p className="ml-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Odgovor:{" "}
                  </span>
                  {r.reply_body}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {r.status === "published" ? (
                  <>
                    <ActionButton
                      action={moderateReview.bind(null, r.id, "hidden")}
                      label="Sakrij"
                      variant="danger"
                      confirm="Sakriti recenziju? Autor je i dalje vidi."
                    />
                    <ActionButton
                      action={moderateReview.bind(null, r.id, "removed")}
                      label="Ukloni"
                      variant="danger"
                      note="Razlog (za istoriju)"
                    />
                  </>
                ) : (
                  <ActionButton
                    action={moderateReview.bind(null, r.id, "published")}
                    label="Vrati"
                    confirm="Ponovo objaviti recenziju?"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          Nema recenzija.
        </p>
      )}
      <Pager
        pathname="/admin/recenzije"
        page={page}
        pages={pages}
        query={{ filter }}
      />
    </div>
  );
}
