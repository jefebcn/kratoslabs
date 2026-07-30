import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

/** Barra utility in cima: accesso/registrazione a sinistra, valuta/lingua a destra. */
export function AccountBar() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 py-2 pr-3 text-xs font-semibold uppercase tracking-wide text-text transition-colors hover:text-accent"
          >
            <LogIn className="size-3.5 text-accent" aria-hidden />
            Accedi
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 py-2 pl-3 text-xs font-semibold uppercase tracking-wide text-text transition-colors hover:text-accent"
          >
            <UserPlus className="size-3.5 text-accent" aria-hidden />
            Registrati
          </Link>
        </div>
        <div className="flex items-center">
          <CurrencyToggle />
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}
