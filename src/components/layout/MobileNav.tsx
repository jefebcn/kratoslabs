"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
import type { Category } from "@/types";
import { categoryIcon } from "@/lib/category-icons";

/** Pagine nel drawer: href, icona e chiave di traduzione (namespace nav). */
const PAGES: { href: string; icon: LucideIcon; key: string }[] = [
  { href: "/guide", icon: BookOpen, key: "guide" },
  { href: "/recensioni", icon: Star, key: "reviews" },
  { href: "/analisi", icon: ScrollText, key: "analysisLong" },
  { href: "/chi-siamo", icon: Info, key: "aboutUs" },
  { href: "/contatto", icon: Mail, key: "contact" },
  { href: "/all-ingrosso", icon: Store, key: "wholesale" },
];

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const tNav = useTranslations("nav");
  const tMenu = useTranslations("menu");
  const tAcc = useTranslations("account");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={tMenu("title")}
        className="inline-flex size-10 items-center justify-center rounded-base text-text transition-colors hover:bg-surface-2 lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        // Non spostare il focus sul campo di ricerca all'apertura: su mobile
        // farebbe comparire la tastiera senza che l'utente l'abbia richiesto.
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>{tMenu("title")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
          <SearchForm onSubmitted={close} />

          <nav className="flex flex-col" aria-label={tMenu("categories")}>
            <p className="pb-1 text-xs font-medium uppercase tracking-wide text-muted">
              {tMenu("categories")}
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
            {PAGES.map(({ href, icon: Icon, key }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="flex items-center gap-3 py-2 text-sm transition-colors hover:text-accent"
              >
                <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                {tNav(key)}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <Button asChild onClick={close}>
              <Link href="/login">{tAcc("login")}</Link>
            </Button>
            <Button asChild variant="outline" onClick={close}>
              <Link href="/register">{tAcc("register")}</Link>
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
