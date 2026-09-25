"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { isOpenNow, type Hours } from "@/lib/format";

const subscribe = () => () => {};

/** Computed in the browser: pages are cached, so the server can't know "now". */
export function OpenNowBadge({
  hours,
  emergency,
}: {
  hours: Hours[];
  emergency: boolean;
}) {
  const t = useTranslations("Common");
  const open = useSyncExternalStore(
    subscribe,
    () => isOpenNow(hours, emergency),
    () => false,
  );
  if (!open) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
      <span className="size-1.5 rounded-full bg-success" aria-hidden />
      {t("openNow")}
    </span>
  );
}
