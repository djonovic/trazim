"use client";

import { createContext, use, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/routing";

type Paths = Partial<Record<Locale, string>>;

const AlternatesContext = createContext<{
  paths: Paths | null;
  setPaths: (paths: Paths | null) => void;
}>({ paths: null, setPaths: () => {} });

export function AlternatesProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<Paths | null>(null);
  return (
    <AlternatesContext value={{ paths, setPaths }}>
      {children}
    </AlternatesContext>
  );
}

/** Rendered by each page so the language switcher links to the same page in other locales. */
export function SetAlternates({ paths }: { paths: Paths }) {
  const { setPaths } = use(AlternatesContext);
  const key = JSON.stringify(paths);
  useEffect(() => {
    setPaths(JSON.parse(key));
    return () => setPaths(null);
  }, [key, setPaths]);
  return null;
}

export function useAlternates() {
  return use(AlternatesContext).paths;
}
