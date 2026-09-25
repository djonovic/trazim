import { NextResponse } from "next/server";
import { z } from "zod";
import { siteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

// Banner click: counted, then redirected to the advertiser (or to the
// advertising offer if the banner has ended).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const fallback = new URL("/za-biznise#baneri", siteUrl);
  if (!z.uuid().safeParse(id).success) return NextResponse.redirect(fallback);
  const { data } = await createAdminClient().rpc("track_banner_click", {
    p_banner_id: id,
  });
  return NextResponse.redirect(data ? new URL(data) : fallback, 302);
}
