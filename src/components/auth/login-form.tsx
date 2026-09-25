"use client";

import { Loader2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { callbackUrl } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="currentColor">
      <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7a4.5 4.5 0 0 0-3.5-1.9c-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.8-3.2-.8a4.7 4.7 0 0 0-4 2.4c-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4a10 10 0 0 0 1.4-2.8 4.2 4.2 0 0 1-2.6-3.8ZM14 5.4a4.2 4.2 0 0 0 1-3.1 4.4 4.4 0 0 0-2.9 1.5 4.1 4.1 0 0 0-1 3 3.7 3.7 0 0 0 2.9-1.4Z" />
    </svg>
  );
}

/** Google, Apple or a magic link. `next` is where the user lands after signing in. */
export function LoginForm({ next }: { next: string }) {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<Provider | "email" | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function oauth(provider: Provider) {
    setPending(provider);
    setError(null);
    const { error } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl(window.location.origin, next) },
    });
    // On success the browser is already navigating to the provider.
    if (error) {
      setError(t("error"));
      setPending(null);
    }
  }

  async function magicLink(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(t("invalidEmail"));
      return;
    }
    setPending("email");
    setError(null);
    const { error } = await createClient().auth.signInWithOtp({
      email: value,
      options: { emailRedirectTo: callbackUrl(window.location.origin, next) },
    });
    setPending(null);
    if (error) {
      setError(error.status === 429 ? t("rateLimited") : t("error"));
      return;
    }
    setSentTo(value);
  }

  if (sentTo) {
    return (
      <div className="space-y-3 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Mail className="size-6" aria-hidden />
        </span>
        <h2 className="text-xl font-bold">{t("checkEmail")}</h2>
        <p className="text-muted-foreground">
          {t("checkEmailText", { email: sentTo })}
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("useOtherEmail")}
        </button>
      </div>
    );
  }

  const providerButton = (
    provider: Provider,
    label: string,
    icon: React.ReactNode,
    dark = false,
  ) => (
    <button
      type="button"
      onClick={() => oauth(provider)}
      disabled={pending != null}
      className={
        dark
          ? "flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-black font-semibold text-white hover:bg-black/85 disabled:opacity-60"
          : "flex h-12 w-full items-center justify-center gap-3 rounded-xl border bg-white font-semibold hover:bg-muted disabled:opacity-60"
      }
    >
      {pending === provider ? (
        <Loader2 className="size-5 animate-spin" aria-hidden />
      ) : (
        icon
      )}
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      {providerButton("google", t("google"), <GoogleIcon />)}
      {providerButton("apple", t("apple"), <AppleIcon />, true)}

      <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        {t("or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={magicLink} className="space-y-3" noValidate>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("email")}</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          disabled={pending != null}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {pending === "email" && (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          )}
          {t("sendLink")}
        </button>
      </form>

      {error && (
        <p role="alert" className="text-center text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="text-center text-xs text-muted-foreground">{t("terms")}</p>
    </div>
  );
}
