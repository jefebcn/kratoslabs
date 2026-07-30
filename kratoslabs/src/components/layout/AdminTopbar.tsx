"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Store } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/layout/Logo";

export function AdminTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Apri menu amministrazione"
          className="inline-flex size-10 items-center justify-center rounded-base text-text transition-colors hover:bg-surface-2 lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </SheetTrigger>
        <SheetContent side="left" aria-describedby={undefined}>
          <SheetHeader>
            <SheetTitle>Amministrazione</SheetTitle>
          </SheetHeader>
          <div className="p-3">
            <AdminNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="lg:hidden">
        <Logo />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <Store className="size-4" aria-hidden />
          <span className="hidden sm:inline">Vai allo store</span>
        </Link>
        <div
          className="size-8 rounded-full border border-border bg-surface-2"
          aria-hidden
        />
      </div>
    </header>
  );
}
