import { setRequestLocale } from "next-intl/server";
import { moderateInquiry } from "@/app/actions/admin";
import { ActionButton } from "@/components/admin/action-button";
import { Badge, formatDateTime } from "@/components/admin/ui";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import { listAdminInquiries } from "@/lib/queries/admin";
import { nameMaps } from "@/lib/queries/taxonomy";

export const metadata = { title: "Upiti" };

export default async function AdminInquiries({
  params,
}: PageProps<"/[locale]/admin/upiti">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const [rows, { cityNames, serviceNames }] = await Promise.all([
    listAdminInquiries(),
    nameMaps("sr-Latn-ME"),
  ]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Upiti</h1>
        <p className="text-muted-foreground">
          Objavljuju se odmah; odbij spam ili uvredljive upite.
        </p>
      </header>
      {rows.length ? (
        <ul className="space-y-3">
          {rows.map((i) => (
            <li
              key={i.id}
              className="space-y-2 rounded-2xl border bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">
                  {serviceNames[i.service_id]} · {cityNames[i.city_id]}
                </span>
                {i.business && <Badge>samo: {i.business.name}</Badge>}
                {i.urgent && <Badge tone="bad">hitno</Badge>}
                {i.status === "rejected" && <Badge tone="bad">odbijen</Badge>}
                {i.status === "closed" && <Badge>zatvoren</Badge>}
                <span className="text-muted-foreground">
                  {formatDateTime(i.created_at)} ·{" "}
                  {i.author?.full_name ?? "korisnik"} · {i.phone} · otvorilo{" "}
                  {i.inquiry_reveals.length}
                </span>
              </div>
              <p className="text-[15px] whitespace-pre-line">{i.body}</p>
              {i.status === "approved" ? (
                <ActionButton
                  action={moderateInquiry.bind(null, i.id, "rejected")}
                  label="Odbij"
                  variant="danger"
                  note="Razlog (za istoriju)"
                />
              ) : i.status === "rejected" ? (
                <ActionButton
                  action={moderateInquiry.bind(null, i.id, "approved")}
                  label="Vrati"
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          Još nema upita.
        </p>
      )}
    </div>
  );
}
