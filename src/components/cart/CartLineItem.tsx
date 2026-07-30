"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Money } from "@/components/ui/money";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { useCart } from "@/features/cart";
import { priceLine } from "@/features/products";
import type { CartLine } from "@/types";

export function CartLineItem({ line }: { line: CartLine }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const priced = priceLine(line.unitPriceCents, line.quantity);

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={`/products/${line.slug}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-base border border-border bg-surface-2"
      >
        <Image
          src={line.imageUrl}
          alt={line.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{line.title}</p>
            <p className="text-xs text-muted">
              <Money cents={line.unitPriceCents} /> / pz
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(line.productId)}
            aria-label={`Rimuovi ${line.title} dal carrello`}
            className="shrink-0 text-muted transition-colors hover:text-danger"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <QuantitySelector
            value={line.quantity}
            onChange={(q) => setQuantity(line.productId, q)}
            min={1}
            max={99}
            className="h-8"
          />
          <Money cents={priced.netCents} className="text-sm font-medium" />
        </div>
      </div>
    </div>
  );
}
