"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/layout/SearchBar";
import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { NAV_LINKS } from "@/lib/constants";
import type { Category } from "@/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Apri menu"
        className="inline-flex size-10 items-center justify-center rounded-base text-text transition-colors hover:bg-surface-2 lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
          <SearchForm onSubmitted={close} />

          <nav className="flex flex-col" aria-label="Categorie">
            <p className="pb-1 text-xs font-medium uppercase tracking-wide text-muted">
              Categorie
            </p>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                onClick={close}
                className="py-2 text-sm transition-colors hover:text-accent"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <nav
            className="flex flex-col border-t border-border pt-4"
            aria-label="Pagine"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="py-2 text-sm transition-colors hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <Button asChild onClick={close}>
              <Link href="/login">Accedi</Link>
            </Button>
            <Button asChild variant="outline" onClick={close}>
              <Link href="/register">Registrati</Link>
            </Button>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-border p-5">
          <CurrencyToggle />
          <LanguageToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
