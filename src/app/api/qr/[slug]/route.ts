import QRCode from "qrcode";
import { getBusinessProfile } from "@/lib/queries/businesses";
import { siteUrl } from "@/lib/env";

// QR code (SVG) pointing to a business profile, for print (vehicle, flyers).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!(await getBusinessProfile(slug)))
    return new Response("Not found", { status: 404 });
  const svg = await QRCode.toString(new URL(`/b/${slug}`, siteUrl).toString(), {
    type: "svg",
    margin: 1,
    color: { dark: "#101828", light: "#ffffff" },
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "Content-Disposition": `inline; filename="trazim-${slug}-qr.svg"`,
    },
  });
}
