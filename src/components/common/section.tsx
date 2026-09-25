import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  title,
  action,
  children,
  className,
  id,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={cn("space-y-4", className)} aria-labelledby={id}>
      <div className="flex items-end justify-between gap-4">
        <h2 id={id} className="text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function LinkGrid({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-2 text-[15px] sm:grid-cols-2 lg:grid-cols-3">
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} className="text-primary hover:underline">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
