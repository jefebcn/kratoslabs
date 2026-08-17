"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
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
import { useCart, useCartCount, useCartSummary } from "@/features/cart";
import {
  MIN_ORDER_CENTS,
  meetsMinimumOrder,
  remainingForMinimumOrder,
} from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const t = useTranslations("cart");
  const isOpen = useCart((s) => s.isOpen);
  const open = useCart((s) => s.open);
  const close = useCart((s) => s.close);
  const lines = useCart((s) => s.lines);
  const count = useCartCount();
  const { subtotalNetCents } = useCartSummary();
  const belowMinimum = !meetsMinimumOrder(subtotalNetCents);
  const missingForMin = remainingForMinimumOrder(subtotalNetCents);

  return (
    <Sheet open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
      <SheetContent side="right" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>
            {t("title")}
            {count > 0 && <span className="num text-muted"> ({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="size-8 text-muted" aria-hidden />
            <p className="text-muted">{t("empty")}</p>
            <Button variant="outline" asChild onClick={close}>
              <Link href="/products">{t("exploreCatalog")}</Link>
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
              {belowMinimum && (
                <p className="rounded-base border border-accent/40 bg-accent-soft/40 px-3 py-2 text-xs">
                  {t("belowMinimum", {
                    min: formatPrice(MIN_ORDER_CENTS),
                    remaining: formatPrice(missingForMin),
                  })}
                </p>
              )}
              <div className="flex flex-col gap-2">
                {belowMinimum ? (
                  <Button size="lg" disabled>
                    {t("minOrderButton", { min: formatPrice(MIN_ORDER_CENTS) })}
                  </Button>
                ) : (
                  <Button asChild size="lg" onClick={close}>
                    <Link href="/checkout">{t("goToCheckout")}</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={close}>
                  {t("continueShopping")}
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
