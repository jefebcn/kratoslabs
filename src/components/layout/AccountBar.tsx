import Link from "next/link";
import { useTranslations } from "next-intl";
import { Info, Mail, Store, type LucideIcon } from "lucide-react";
import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { AccountMenu } from "@/components/layout/AccountMenu";

/**
 * Barra utility in cima. Visibile solo da `sm` in su.
 *
 * Su mobile è nascosta: occupava 40px della prima schermata per offrire
 * "accedi" e la lingua a un visitatore che spesso arriva da un social e non
 * ha ancora visto un prodotto. Entrambe le voci — più registrazione, valuta e
 * link informativi — sono già nel menu hamburger, quindi non si perde nulla e
 * si guadagna spazio dove serve.
 *
 * Da `sm` in su: voci informative a sinistra; valuta, lingua e account a destra.
 */
export function AccountBar() {
  const t = useTranslations("nav");
  const topLinks: { href: string; label: string; icon: LucideIcon }[] = [
    { href: "/chi-siamo", label: t("aboutUs"), icon: Info },
    { href: "/contatto", label: t("contact"), icon: Mail },
    { href: "/all-ingrosso", label: t("wholesale"), icon: Store },
  ];
  return (
    <div className="hidden bg-[#2a2e35] text-white sm:block">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Sinistra */}
        <div className="flex items-center">
          <nav className="hidden items-center gap-3 sm:flex">
            {topLinks.map(({ href, label, icon: Icon }) => (
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
