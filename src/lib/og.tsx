import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import type { ReactNode } from "react";

// Shared look for generated social images (1200×630) and the logo.
export const OG_SIZE = { width: 1200, height: 630 };

export const BRAND = {
  primary: "#1f4b9e",
  primaryDark: "#173a7c",
  warm: "#f2b53f",
  ink: "#101828",
  muted: "#5b6478",
  soft: "#eef2f9",
};

const FONT_DIR = join(process.cwd(), "src/assets/fonts");
let fontsPromise: Promise<
  { name: string; data: Buffer; weight: 600 | 800; style: "normal" }[]
> | null = null;

/** Manrope (OFL) latin, latin-ext and cyrillic, so č/ž/đ and Russian render. */
function fonts() {
  fontsPromise ??= Promise.all(
    (["latin", "latin-ext", "cyrillic"] as const).flatMap((subset) =>
      ([600, 800] as const).map(async (weight) => ({
        name: "Manrope",
        data: await readFile(
          join(FONT_DIR, `manrope-${subset}-${weight}-normal.woff`),
        ),
        weight,
        style: "normal" as const,
      })),
    ),
  );
  return fontsPromise;
}

export async function ogImage(
  element: ReactNode,
  size: { width: number; height: number } = OG_SIZE,
) {
  return new ImageResponse(element as React.ReactElement, {
    ...size,
    fonts: await fonts(),
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}

/** The logo mark (search glass on a blue tile), as used in the header. */
export function LogoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect width="32" height="32" rx="9" fill={BRAND.primary} />
      <circle
        cx="14.5"
        cy="14"
        r="6.5"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M19.5 19l5 5"
        stroke={BRAND.warm}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Manrope has no ★/✓ glyphs; draw them.
function StarIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z"
        fill={BRAND.warm}
      />
    </svg>
  );
}

function CheckIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke={BRAND.primary}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Standard card: brand header, big title, subtitle, up to three stats and an
 * optional photo on the right.
 */
export function OgCard({
  eyebrow,
  eyebrowCheck = false,
  title,
  subtitle,
  stats = [],
  photo,
  footer = "trazim.me",
}: {
  eyebrow?: string;
  /** Prefix the eyebrow with a check mark ("Provjeren"). */
  eyebrowCheck?: boolean;
  title: string;
  subtitle?: string;
  stats?: { label: string; value: string; star?: boolean }[];
  photo?: string | null;
  footer?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: `linear-gradient(135deg, #ffffff 0%, ${BRAND.soft} 100%)`,
        fontFamily: "Manrope",
        color: BRAND.ink,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LogoMark size={56} />
          <span style={{ fontSize: 36, fontWeight: 800 }}>Tražim</span>
          {eyebrow && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginLeft: 12,
                fontSize: 24,
                fontWeight: 600,
                color: BRAND.primary,
                background: "white",
                border: `2px solid ${BRAND.soft}`,
                borderRadius: 999,
                padding: "6px 18px",
              }}
            >
              {eyebrowCheck && <CheckIcon />}
              {eyebrow}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: title.length > 40 ? 58 : 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 30, fontWeight: 600, color: BRAND.muted }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
          {stats.slice(0, 3).map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "white",
                borderRadius: 20,
                padding: "16px 24px",
                boxShadow: "0 2px 8px rgba(16,24,40,0.06)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 38,
                  fontWeight: 800,
                  color: BRAND.primary,
                }}
              >
                {s.star && <StarIcon />}
                {s.value}
              </span>
              <span
                style={{ fontSize: 20, fontWeight: 600, color: BRAND.muted }}
              >
                {s.label}
              </span>
            </div>
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 24,
              fontWeight: 600,
              color: BRAND.muted,
            }}
          >
            {footer}
          </span>
        </div>
      </div>
      {photo && (
        <div style={{ display: "flex", width: 420, height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            width={420}
            height={630}
            style={{ objectFit: "cover" }}
            alt=""
          />
        </div>
      )}
    </div>
  );
}

/**
 * Photos are stored as WebP, which the image renderer can't read; fetch and
 * convert to a small JPEG data URL. Returns null on any failure.
 */
export async function photoForOg(url: string | null | undefined) {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(420, 630, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}
