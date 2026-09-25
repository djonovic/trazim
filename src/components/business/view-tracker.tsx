"use client";

import { useEffect } from "react";
import { trackView } from "@/app/actions/views";

/** Counts one view per business per browser session. */
export function ViewTracker({ businessId }: { businessId: string }) {
  useEffect(() => {
    const key = `trazim.viewed.${businessId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage blocked: still count the view.
    }
    void trackView(businessId);
  }, [businessId]);
  return null;
}
