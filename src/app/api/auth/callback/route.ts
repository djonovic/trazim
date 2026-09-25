import { NextResponse, type NextRequest } from "next/server";
import { loginPathFor, safeNext } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

/** OAuth (Google) and magic-link landing: exchanges the PKCE code for a session cookie. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
    console.error("exchangeCodeForSession failed", error.message);
  }

  const login = new URL(loginPathFor(next), origin);
  login.searchParams.set("error", "callback");
  login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}
