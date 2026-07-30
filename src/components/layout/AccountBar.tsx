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

/** Barra utility in cima: link informativi a sinistra, account/lingua a destra. */
export function AccountBar() {
  return (
    <div className="bg-[#2a2e35] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <nav className="flex items-center gap-1 sm:gap-3">
          {TOP_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-accent"
            >
              <Icon className="size-3.5 text-accent" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          <CurrencyToggle />
          <LanguageToggle />
          <span className="mx-1 hidden text-white/20 sm:inline">|</span>
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
