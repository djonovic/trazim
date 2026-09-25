import { setRequestLocale } from "next-intl/server";
import {
  moderateBusiness,
  moderateReview,
  resolveReport,
} from "@/app/actions/admin";
import { ActionButton } from "@/components/admin/action-button";
import {
  Badge,
  FilterTabs,
  formatDateTime,
  REPORT_REASONS,
} from "@/components/admin/ui";
import { Stars } from "@/components/business/review-list";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import { listAdminReports, type AdminReportFilter } from "@/lib/queries/admin";

export const metadata = { title: "Prijave" };

export default async function AdminReports({
  params,
  searchParams,
}: PageProps<"/[locale]/admin/prijave">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const filter: AdminReportFilter =
    (await searchParams).filter === "closed" ? "closed" : "open";
  const reports = await listAdminReports(filter);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold tracking-tight">Prijave</h1>
      <FilterTabs
        pathname="/admin/prijave"
        current={filter}
        options={[
          { value: "open", label: "Otvorene" },
          { value: "closed", label: "Zatvorene" },
        ]}
      />
      {reports.length ? (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li
              key={r.id}
              className="space-y-3 rounded-2xl border bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge tone="warn">{REPORT_REASONS[r.reason]}</Badge>
                <Badge>{r.target === "review" ? "Recenzija" : "Profil"}</Badge>
                <span className="text-muted-foreground">
                  {formatDateTime(r.created_at)} · prijavio{" "}
                  {r.reporter?.full_name ?? "korisnik"}
                </span>
                {r.status !== "open" && (
                  <Badge tone="neutral">
                    {r.status === "resolved" ? "Riješena" : "Odbačena"}
                  </Badge>
                )}
              </div>
              {r.details && <p className="text-[15px]">„{r.details}”</p>}

              <div className="rounded-xl bg-muted/60 p-3 text-sm">
                {r.business && (
                  <p>
                    <Link
                      href={{
                        pathname: "/admin/profili/[id]",
                        params: { id: r.business.id },
                      }}
                      className="font-semibold text-primary hover:underline"
                    >
                      {r.business.name}
                    </Link>
                    {r.business.status !== "active" && (
                      <span className="ml-2">
                        <Badge tone="bad">{r.business.status}</Badge>
                      </span>
                    )}
                  </p>
                )}
                {r.review && (
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-2">
                      <Stars value={r.review.rating} />
                      <span className="text-muted-foreground">
                        {r.review.author?.full_name ?? "Korisnik"}
                      </span>
                      {r.review.status !== "published" && (
                        <Badge tone="bad">
                          {r.review.status === "hidden"
                            ? "sakrivena"
                            : "uklonjena"}
                        </Badge>
                      )}
                    </p>
                    {r.review.body && (
                      <p className="whitespace-pre-line">{r.review.body}</p>
                    )}
                  </div>
                )}
              </div>

              {r.status === "open" ? (
                <div className="flex flex-wrap items-start gap-2">
                  {r.review && r.review.status === "published" && (
                    <ActionButton
                      action={moderateReview.bind(null, r.review.id, "hidden")}
                      label="Sakrij recenziju"
                      variant="danger"
                      confirm="Sakriti recenziju sa sajta?"
                    />
                  )}
                  {r.target === "business" &&
                    r.business?.status === "active" && (
                      <ActionButton
                        action={moderateBusiness.bind(
                          null,
                          r.business.id,
                          "suspend",
                        )}
                        label="Suspenduj profil"
                        variant="danger"
                        note="Razlog (vlasnik ga vidi u panelu)"
                        noteRequired
                      />
                    )}
                  <ActionButton
                    action={resolveReport.bind(null, r.id, "resolved")}
                    label="Riješeno"
                    variant="primary"
                    note="Napomena (opciono)"
                  />
                  <ActionButton
                    action={resolveReport.bind(null, r.id, "dismissed")}
                    label="Odbaci"
                    confirm="Odbaciti prijavu bez akcije?"
                  />
                </div>
              ) : (
                r.resolution_note && (
                  <p className="text-sm text-muted-foreground">
                    Napomena: {r.resolution_note}
                  </p>
                )
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          {filter === "open"
            ? "Nema otvorenih prijava. 🎉"
            : "Nema zatvorenih prijava."}
        </p>
      )}
    </div>
  );
}
