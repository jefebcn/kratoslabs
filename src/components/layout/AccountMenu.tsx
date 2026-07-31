"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogIn, UserPlus, LogOut, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Stato account nell'header. Legge la sessione lato client (i cookie Supabase
 * sono condivisi col server), così le pagine restano statiche.
 */
export function AccountMenu() {
  const router = useRouter();
  const t = useTranslations("account");
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setEmail(null);
    router.push("/");
    router.refresh();
  }

  // Prima dell'idratazione mostriamo i link di default (evita sfarfallio).
  if (ready && email) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/account"
          className="inline-flex max-w-[10rem] items-center gap-1.5 py-2 pr-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-accent"
          title={email}
        >
          <UserIcon className="size-3.5 text-accent" aria-hidden />
          <span className="truncate">{email}</span>
        </Link>
        <span className="text-white/25">|</span>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 py-2 pl-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-accent"
        >
          <LogOut className="size-3.5 text-accent" aria-hidden />
          {t("logout")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-accent"
      >
        <LogIn className="size-3.5 text-accent" aria-hidden />
        {t("login")}
      </Link>
      <span className="text-border">|</span>
      <Link
        href="/register"
        className="inline-flex items-center gap-1.5 py-2 pl-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-accent"
      >
        <UserPlus className="size-3.5 text-accent" aria-hidden />
        {t("register")}
      </Link>
    </div>
  );
}
