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

/** Where Google sends the user back to. */
export function callbackUrl(origin: string, next: string) {
  return `${origin}/api/auth/callback?next=${encodeURIComponent(safeNext(next))}`;
}

/** Login page the email link opens. The token is used only after a button click. */
export function emailConfirmUrl(origin: string, path: string, next: string) {
  const url = new URL(path, origin);
  url.searchParams.set("next", safeNext(next));
  return url.toString();
}
