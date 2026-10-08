"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LogIn, UserPlus, LogOut, User as UserIcon } from "lucide-react";
import { useSessionEmail } from "@/hooks/use-session-email";

/**
 * Stato account nell'header. Legge la sessione lato client (i cookie Supabase
 * sono condivisi col server), così le pagine restano statiche.
 */
export function AccountMenu() {
  const t = useTranslations("account");
  const { email, ready, logout: handleLogout } = useSessionEmail();

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
