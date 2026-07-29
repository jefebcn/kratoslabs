"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart, useCartCount } from "@/features/cart";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const open = useCart((s) => s.open);
  const close = useCart((s) => s.close);
  const lines = useCart((s) => s.lines);
  const count = useCartCount();

  return (
    <Sheet open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
      <SheetContent side="right" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>
            Carrello
            {count > 0 && <span className="num text-muted"> ({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="size-8 text-muted" aria-hidden />
            <p className="text-muted">Il carrello è vuoto.</p>
            <Button variant="outline" asChild onClick={close}>
              <Link href="/products">Esplora il catalogo</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {lines.map((line) => (
                <CartLineItem key={line.productId} line={line} />
              ))}
            </div>

            <SheetFooter className="flex flex-col gap-4">
              <CartSummary />
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" onClick={close}>
                  <Link href="/checkout">Vai al checkout</Link>
                </Button>
                <Button variant="ghost" onClick={close}>
                  Continua lo shopping
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
