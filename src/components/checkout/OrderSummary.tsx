"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Money } from "@/components/ui/money";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/features/cart";
import { priceLine } from "@/features/products";

export function OrderSummary() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const lines = useCart((s) => s.lines);

  if (lines.length === 0) {
    return (
      <div className="rounded-base border border-border bg-surface p-6 text-sm text-muted">
        {tCart("empty")}{" "}
        <Link href="/products" className="text-accent hover:underline">
          {t("goToCatalog")}
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="rounded-base border border-border bg-surface p-5">
      <h2 className="text-sm font-medium">{t("summary")}</h2>
      <ul className="mt-4 flex flex-col divide-y divide-border">
        {lines.map((l) => (
          <li key={l.productId} className="flex items-center gap-3 py-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-[3px] border border-border bg-surface-2">
              <Image
                src={l.imageUrl}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display truncate text-sm font-semibold uppercase tracking-tight">
                {l.title}
              </p>
              <p className="num text-xs text-muted">× {l.quantity}</p>
            </div>
            <Money
              cents={priceLine(l.unitPriceCents, l.quantity).netCents}
              className="text-sm"
            />
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-border pt-4">
        <CartSummary />
      </div>
    </div>
  );
}
