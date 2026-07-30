import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { SearchForm } from "@/components/layout/SearchBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartButton } from "@/components/cart/CartButton";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <MobileNav />

        {/* Logo: centrato su mobile, a sinistra su desktop */}
        <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
          <Logo />
        </div>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Navigazione principale"
        >
          <MegaMenu />
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 text-sm font-medium text-text transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 lg:ml-auto">
          <div className="hidden w-56 lg:block">
            <SearchForm />
          </div>
          <CartButton />
        </div>
      </div>

      {/* Ricerca a tutta larghezza su mobile, come da configurazione richiesta */}
      <div className="border-t border-border px-4 py-2 lg:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
