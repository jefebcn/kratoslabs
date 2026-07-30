import Link from "next/link";
import { Info, Mail, Store, type LucideIcon } from "lucide-react";
import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { AccountMenu } from "@/components/layout/AccountMenu";

const TOP_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/chi-siamo", label: "Chi siamo", icon: Info },
  { href: "/contatto", label: "Contatto", icon: Mail },
  { href: "/all-ingrosso", label: "All'ingrosso", icon: Store },
];

/**
 * Barra utility in cima.
 *  - Mobile: solo account (sinistra) e lingua (destra), per non affollare.
 *    Le voci informative e la valuta vivono nel menu hamburger.
 *  - Desktop: voci informative a sinistra; valuta, lingua e account a destra.
 */
export function AccountBar() {
  return (
    <div className="bg-[#2a2e35] text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Sinistra */}
        <div className="flex items-center">
          <nav className="hidden items-center gap-3 sm:flex">
            {TOP_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-accent"
              >
                <Icon className="size-3.5 text-accent" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
          {/* Su mobile l'account sta a sinistra (stile competitor). */}
          <div className="sm:hidden">
            <AccountMenu />
          </div>
        </div>

        {/* Destra */}
        <div className="flex items-center">
          <div className="hidden sm:block">
            <CurrencyToggle />
          </div>
          <LanguageToggle />
          <span className="mx-1 hidden text-white/20 sm:inline">|</span>
          <div className="hidden sm:block">
            <AccountMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
