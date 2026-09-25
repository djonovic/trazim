/** Only same-site paths ("/panel", "/en/b/x"); blocks "//evil.com" and "https://…" open redirects. */
export function safeNext(value: string | null | undefined, fallback = "/") {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  )
    return fallback;
  return value;
}

/** Where OAuth providers and magic links send the user back to. */
export function callbackUrl(origin: string, next: string) {
  return `${origin}/api/auth/callback?next=${encodeURIComponent(safeNext(next))}`;
}
