"use client";

import { useState } from "react";
import { Money } from "@/components/ui/money";
import { PriceBlock } from "@/components/product/PriceBlock";
import { StockBadge } from "@/components/product/StockBadge";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { BulkPricingTable } from "@/components/product/BulkPricingTable";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { QuickCheckoutButton } from "@/components/cart/QuickCheckoutButton";
import { bulkDiscountFor, nextBulkTier, priceLine } from "@/features/products";
import type { Product } from "@/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  const maxQty = soldOut ? 1 : Math.min(product.stock, 99);

  const priced = priceLine(product.priceCents, qty);
  const discount = bulkDiscountFor(qty);
  const next = nextBulkTier(qty);

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
          {discount > 0 && (
            <span className="num ml-1.5 text-accent">
              −{Math.round(discount * 100)}%
            </span>
          )}
        </p>
      </div>

      {next && !soldOut && (
        <p className="text-xs text-muted">
          Aggiungi ancora{" "}
          <span className="num text-text">{next.minQuantity - qty}</span>{" "}
          {next.minQuantity - qty === 1 ? "pezzo" : "pezzi"} per lo sconto del{" "}
          <span className="num text-accent">
            {Math.round(next.discount * 100)}%
          </span>
          .
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <AddToCartButton
          product={product}
          quantity={qty}
          size="lg"
          className="flex-1"
        />
        <QuickCheckoutButton
          product={product}
          quantity={qty}
          size="lg"
          className="flex-1"
        />
      </div>

      <BulkPricingTable activeQuantity={qty} />
    </div>
  );
}
