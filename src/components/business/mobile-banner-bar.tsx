"use client";

import { X } from "lucide-react";
import { useState, useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};
const KEY = "trazim.banner.closed";

/** Booked banner as a strip at the bottom of phone screens; closable for the session. */
export function MobileBannerBar({
  bannerId,
  closeLabel,
  children,
}: {
  bannerId: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const storedClosed = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return sessionStorage.getItem(KEY) === bannerId;
      } catch {
        return false;
      }
    },
    () => false,
  );
  const [closed, setClosed] = useState(false);
  if (closed || storedClosed) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 p-2 lg:hidden">
      <div className="relative">
        {children}
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => {
            setClosed(true);
            try {
              sessionStorage.setItem(KEY, bannerId);
            } catch {}
          }}
          className="absolute -top-2 -right-1 rounded-full bg-foreground p-1.5 text-background shadow"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
