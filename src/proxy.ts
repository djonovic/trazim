import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  return updateSession(request, response);
}

export const config = {
  // Skip API routes, Next internals, files with an extension and generated
  // social images (their URLs carry the internal locale prefix), and the
  // generated favicons (/icon, /apple-icon), which would otherwise 404.
  matcher:
    "/((?!api|r/|_next|_vercel|icon$|apple-icon$|.*\\..*|.*opengraph-image).*)",
};
