import { getBusinessProfile } from "@/lib/queries/businesses";

// "Preporučeno na Tražim" badge for a business's own website (links back to
// its profile). /api/badge/{slug}?lang=en|ru — SVG, cached for an hour.
const TEXT = {
  me: {
    title: "Preporučeno na",
    reviews: (n: number) =>
      `${n} ${n % 10 === 1 && n % 100 !== 11 ? "recenzija" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "recenzije" : "recenzija"}`,
    none: "Pogledaj profil",
  },
  en: {
    title: "Recommended on",
    reviews: (n: number) => `${n} review${n === 1 ? "" : "s"}`,
    none: "View profile",
  },
  ru: {
    title: "Рекомендовано на",
    reviews: (n: number) =>
      `${n} ${n % 10 === 1 && n % 100 !== 11 ? "отзыв" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "отзыва" : "отзывов"}`,
    none: "Смотреть профиль",
  },
};

const esc = (s: string) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const lang = new URL(request.url).searchParams.get("lang");
  const t = TEXT[lang === "en" || lang === "ru" ? lang : "me"];
  const business = await getBusinessProfile(slug);
  if (!business) return new Response("Not found", { status: 404 });

  const rated = business.rating_count > 0;
  const line = rated
    ? `${Number(business.rating_avg).toFixed(1)} · ${t.reviews(business.rating_count)}`
    : t.none;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64" role="img" aria-label="${esc(`${t.title} Tražim: ${business.name}, ${line}`)}">
  <rect x="0.5" y="0.5" width="239" height="63" rx="14" fill="#ffffff" stroke="#dbe3f0"/>
  <g transform="translate(12 12)">
    <rect width="40" height="40" rx="11" fill="#1f4b9e"/>
    <circle cx="18" cy="17.5" r="8.1" fill="none" stroke="#fff" stroke-width="3.7"/>
    <path d="M24.4 23.8l6.2 6.2" stroke="#f2b53f" stroke-width="4.2" stroke-linecap="round"/>
  </g>
  <text x="64" y="27" font-family="Manrope, Inter, Arial, sans-serif" font-size="12" fill="#5b6478">${esc(t.title)} <tspan font-weight="800" fill="#101828">Tražim</tspan></text>
  ${rated ? `<path transform="translate(64 34) scale(0.62)" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z" fill="#f2b53f"/>` : ""}
  <text x="${rated ? 82 : 64}" y="47" font-family="Manrope, Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="#1f4b9e">${esc(line)}</text>
</svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
