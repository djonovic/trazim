import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AdminNav } from "@/components/admin/admin-nav";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminCounts } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | Tražim" },
  robots: { index: false, follow: false },
};

// Every page checks requireAdmin() again: layouts don't guard their pages.
export default async function AdminLayout({
  children,
  params,
}: LayoutProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale as Locale);
  const counts = await getAdminCounts();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <AdminNav
        counts={{
          "/admin/profili": counts.pending,
          "/admin/prijave": counts.reports,
        }}
      />
      {children}
    </main>
  );
}
