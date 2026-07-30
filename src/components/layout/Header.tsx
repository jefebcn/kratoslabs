import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { SearchBar } from "@/components/layout/SearchBar";
import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartButton } from "@/components/cart/CartButton";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <MobileNav />
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

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchBar />
          <div className="hidden items-center sm:flex">
            <CurrencyToggle />
            <LanguageToggle />
          </div>
          <Link
            href="/login"
            aria-label="Accedi"
            title="Accedi"
            className="inline-flex size-10 items-center justify-center rounded-base text-text transition-colors hover:bg-surface-2"
          >
            <User className="size-5" aria-hidden />
          </Link>
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link href="/register">Registrati</Link>
          </Button>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
