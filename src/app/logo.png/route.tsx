import { LogoMark, ogImage } from "@/lib/og";

// Stable logo URL for Organization structured data (Google wants ≥112px).
export const dynamic = "force-static";

export async function GET() {
  return ogImage(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
      }}
    >
      <LogoMark size={448} />
    </div>,
    { width: 512, height: 512 },
  );
}
