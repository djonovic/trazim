"use client";

import type { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { LoginForm } from "./login-form";

type LoginOptions = {
  /** Contextual title, e.g. "Tvoja recenzija je spremna". */
  title?: string;
  description?: string;
  /** Path to return to after signing in (defaults to the current page). */
  next?: string;
};

const AuthContext = createContext<{
  user: User | null;
  ready: boolean;
  openLogin: (options?: LoginOptions) => void;
}>({ user: null, ready: false, openLogin: () => {} });

export const useAuth = () => use(AuthContext);

/**
 * Session state lives in the browser so public pages stay static; the server
 * only reads the session on /panel and other private routes.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("Auth");
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [login, setLogin] = useState<(LoginOptions & { next: string }) | null>(
    null,
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const openLogin = useCallback((options: LoginOptions = {}) => {
    setLogin({
      ...options,
      next: options.next ?? window.location.pathname + window.location.search,
    });
  }, []);

  return (
    <AuthContext value={{ user, ready, openLogin }}>
      {children}
      <Dialog
        open={login != null}
        onOpenChange={(open) => !open && setLogin(null)}
      >
        <DialogContent className="max-w-md gap-5 rounded-2xl p-6">
          <div className="space-y-1.5 pr-6">
            <DialogTitle className="text-xl font-bold">
              {login?.title ?? t("title")}
            </DialogTitle>
            <DialogDescription>
              {login?.description ?? t("subtitle")}
            </DialogDescription>
          </div>
          {login && <LoginForm next={login.next} />}
        </DialogContent>
      </Dialog>
    </AuthContext>
  );
}
