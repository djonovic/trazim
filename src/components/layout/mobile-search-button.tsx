"use client";

import type { ReactNode } from "react";
import { useSearch } from "@/components/search/search-dialog";

export function MobileSearchButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const { open } = useSearch();
  return (
    <button
      type="button"
      onClick={() => open()}
      aria-label={label}
      className="rounded-full p-2.5 hover:bg-muted md:hidden"
    >
      {children}
    </button>
  );
}
