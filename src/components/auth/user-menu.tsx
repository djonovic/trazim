"use client";

import {
  Briefcase,
  LogOut,
  Shield,
  User as UserIcon,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./auth-provider";

export function UserMenu() {
  const t = useTranslations("Auth");
  const { user, ready, openLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const [adminFor, setAdminFor] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  // Admin link only for admins (RLS lets users read their own profile).
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setAdminFor(data?.role === "admin" ? user.id : null));
  }, [supabase, user]);
  const isAdmin = user != null && adminFor === user.id;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  // Reserve the space while the session loads to avoid layout shift.
  if (!ready) return <span className="size-10" aria-hidden />;

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openLogin()}
        className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-muted"
      >
        <UserRound className="size-5 text-primary" aria-hidden />
        {t("login")}
      </button>
    );
  }

  const name = (user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email ??
    "?") as string;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary ring-1 ring-primary/10 transition hover:ring-primary/30"
        title={name}
        aria-label={name}
      >
        <UserRound className="size-5" strokeWidth={2.2} aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-1.5 shadow-lg"
        >
          <p className="truncate px-3 py-2 text-xs text-muted-foreground">
            {user.email}
          </p>
          <Link
            href="/moj-nalog"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
          >
            <UserIcon className="size-4" aria-hidden />
            {t("myAccount")}
          </Link>
          <Link
            href="/panel"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
          >
            <Briefcase className="size-4" aria-hidden />
            {t("myBusinesses")}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <Shield className="size-4" aria-hidden />
              Admin
            </Link>
          )}
          <form
            action="/api/auth/signout"
            method="post"
            onSubmit={(e) => {
              // Stay on public pages; leave private ones (panel, account) for home.
              const path = window.location.pathname;
              const isPrivate =
                /\/(panel|admin|moj-nalog|my-account|moy-akkaunt)(\/|$)/.test(
                  path,
                );
              (
                e.currentTarget.elements.namedItem("next") as HTMLInputElement
              ).value = isPrivate ? "/" : path;
            }}
          >
            <input type="hidden" name="next" defaultValue="/" />
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <LogOut className="size-4" aria-hidden />
              {t("logout")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
