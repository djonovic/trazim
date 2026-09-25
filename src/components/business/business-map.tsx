"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false });

/** Placeholder until the map scrolls into view; then Leaflet and tiles load. */
export function BusinessMap(props: {
  lat: number;
  lng: number;
  radiusMeters: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative isolate z-0 aspect-[16/9] overflow-hidden rounded-2xl border bg-muted"
    >
      {visible && <LeafletMap {...props} />}
    </div>
  );
}
