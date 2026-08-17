"use client";

import { useState } from "react";
import { Money } from "@/components/ui/money";
import { PriceBlock } from "@/components/product/PriceBlock";
import { StockBadge } from "@/components/product/StockBadge";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { QuickCheckoutButton } from "@/components/cart/QuickCheckoutButton";
import { priceLine } from "@/features/products";
import type { Product } from "@/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  const maxQty = soldOut ? 1 : Math.min(product.stock, 99);

  const priced = priceLine(product.priceCents, qty);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <PriceBlock product={product} size="lg" />
        <StockBadge stock={product.stock} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <QuantitySelector value={qty} onChange={setQty} min={1} max={maxQty} />
        <p className="text-sm text-muted">
          Totale{" "}
          <Money cents={priced.netCents} className="font-semibold text-text" />
        </p>
      </div>

      <div className="flex gap-2 sm:gap-3">
        <AddToCartButton
          product={product}
          quantity={qty}
          size="lg"
          className="h-14 min-w-0 flex-1 whitespace-normal px-2 text-sm font-semibold leading-tight sm:h-12 sm:whitespace-nowrap sm:px-6 sm:text-base"
          iconClassName="size-5 shrink-0"
        />
        <QuickCheckoutButton
          product={product}
          quantity={qty}
          size="lg"
          className="h-14 min-w-0 flex-1 whitespace-normal px-2 text-sm font-semibold leading-tight sm:h-12 sm:whitespace-nowrap sm:px-6 sm:text-base"
          iconClassName="size-5 shrink-0"
        />
      </div>
    </div>
  );
}
