import { Logo } from "@/components/layout/Logo";
import { SearchForm } from "@/components/layout/SearchBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartButton } from "@/components/cart/CartButton";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* Sinistra: hamburger (mobile) + ricerca (desktop) */}
        <div className="flex flex-1 items-center gap-2">
          <MobileNav />
          <div className="hidden w-full max-w-xs lg:block">
            <SearchForm />
          </div>
        </div>

        {/* Centro: logo/wordmark centrato e grande, come da riferimento */}
        <div className="flex shrink-0 justify-center">
          <Logo imgClassName="h-14 sm:h-[4.5rem] lg:h-20" />
        </div>

        {/* Destra: carrello */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <CartButton />
        </div>
      </div>

      {/* Ricerca a tutta larghezza su mobile */}
      <div className="border-t border-border px-4 py-2 lg:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
