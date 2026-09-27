"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/layout/Logo";
import { SearchForm } from "@/components/layout/SearchBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartButton } from "@/components/cart/CartButton";
import type { Category } from "@/types";

export function Header({ categories }: { categories: Category[] }) {
  // Su mobile la ricerca parte chiusa: occupava una riga fissa (~58px) della
  // prima schermata, ed è poco utile a chi arriva da un social e non conosce
  // i nomi dei prodotti. Chi la cerca la apre con un tocco; su desktop resta
  // sempre visibile nella barra come prima.
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations("search");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 lg:static">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* Sinistra: hamburger + lente (mobile), ricerca estesa (desktop).
            La lente sta a sinistra per bilanciare il carrello a destra: con
            due elementi a destra e uno a sinistra il logo centrale veniva
            spinto fuori asse. */}
        <div className="flex flex-1 items-center gap-1">
          <MobileNav categories={categories} />
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-expanded={searchOpen}
            aria-controls="mobile-search"
            aria-label={t("placeholder")}
            className="inline-flex size-10 items-center justify-center rounded-base text-text transition-colors hover:bg-surface-2 hover:text-accent lg:hidden"
          >
            {searchOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Search className="size-5" aria-hidden />
            )}
          </button>
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

      {/* Ricerca a tutta larghezza su mobile, mostrata su richiesta. */}
      {searchOpen && (
        <div
          id="mobile-search"
          className="border-t border-border px-4 py-2 lg:hidden"
        >
          <SearchForm onSubmitted={() => setSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
