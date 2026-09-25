import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const ALL_TAGS = [
  "taxonomy",
  "businesses",
  "sponsorships",
  "reviews",
  "prices",
  "banners",
];

/**
 * Drops cached data immediately. Used by scripts (demo data, imports) and,
 * later, by the Stripe webhook. POST with `Authorization: Bearer $REVALIDATE_SECRET`
 * and an optional JSON body `{ "tags": ["businesses"] }`.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(body.tags)
    ? body.tags.filter(
        (t): t is string => typeof t === "string" && ALL_TAGS.includes(t),
      )
    : ALL_TAGS;
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: tags });
}
