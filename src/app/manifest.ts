import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/og";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tražim",
    short_name: "Tražim",
    description: "Majstori i lokalne usluge u Crnoj Gori",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: BRAND.primary,
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
    ],
  };
}
