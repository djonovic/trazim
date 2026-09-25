"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";

/** Loaded only via next/dynamic from BusinessMap, so Leaflet stays out of the main bundle. */
export default function LeafletMap({
  lat,
  lng,
  radiusMeters,
  label,
}: {
  lat: number;
  lng: number;
  radiusMeters: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([lat, lng], radiusMeters > 1000 ? 12 : 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const color =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim() || "#1d4ed8";
    // An area, not a pin: exact addresses are optional and often private.
    L.circle([lat, lng], {
      radius: radiusMeters,
      color,
      weight: 2,
      fillOpacity: 0.12,
    })
      .addTo(map)
      .bindTooltip(label);
    return () => {
      map.remove();
    };
  }, [lat, lng, radiusMeters, label]);

  return <div ref={ref} className="h-full w-full" />;
}
