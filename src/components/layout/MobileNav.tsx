"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Info,
  Mail,
  Menu,
  ScrollText,
  Star,
  Store,
  type LucideIcon,
} from "lucide-react";
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
import { categoryIcon } from "@/lib/category-icons";

/** Icona per le pagine informative del menu, mappata per href. */
const PAGE_ICON: Record<string, LucideIcon> = {
  "/guide": BookOpen,
  "/recensioni": Star,
  "/analisi": ScrollText,
  "/chi-siamo": Info,
  "/contatto": Mail,
  "/all-ingrosso": Store,
};

/** Pagine nel drawer: risorse + voci informative (queste su mobile stanno
 *  solo qui, per non affollare la barra utility in alto). */
const PAGES: { href: string; label: string }[] = [
  ...NAV_LINKS,
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/contatto", label: "Contatto" },
  { href: "/all-ingrosso", label: "All'ingrosso" },
];

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
            {categories.map((c) => {
              const Icon = categoryIcon(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  onClick={close}
                  className="flex items-center gap-3 py-2 text-sm transition-colors hover:text-accent"
                >
                  <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                  {c.name}
                </Link>
              );
            })}
          </nav>

          <nav
            className="flex flex-col border-t border-border pt-4"
            aria-label="Pagine"
          >
            {PAGES.map((l) => {
              const Icon = PAGE_ICON[l.href];
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="flex items-center gap-3 py-2 text-sm transition-colors hover:text-accent"
                >
                  {Icon && (
                    <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                  )}
                  {l.label}
                </Link>
              );
            })}
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
