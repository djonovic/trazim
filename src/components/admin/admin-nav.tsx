"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/profili", label: "Profili" },
  { href: "/admin/prijave", label: "Prijave" },
  { href: "/admin/recenzije", label: "Recenzije" },
  { href: "/admin/upiti", label: "Upiti" },
  { href: "/admin/sponzorstva", label: "Sponzorstva" },
  { href: "/admin/baneri", label: "Baneri" },
] as const;

export function AdminNav({ counts }: { counts: Record<string, number> }) {
  const pathname = usePathname();
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto border-b px-4">
      {ITEMS.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const count = counts[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold whitespace-nowrap",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
            {count > 0 && (
              <span className="ml-1.5 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-white tabular-nums">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
