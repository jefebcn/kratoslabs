"use client";

import { usePreferences } from "@/features/preferences";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Money } from "@/components/ui/money";
import { Badge } from "@/components/ui/badge";
import { cn, discountPct, formatPricePerActiveGramIn } from "@/lib/utils";
import type { Product } from "@/types";

const sizeMap = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
} as const;

/**
 * Prezzo + prezzo per grammo di attivo, entrambi nella valuta scelta.
 * Il "prezzo per grammo" è il vero metro di paragone tra prodotti.
 */
export function PriceBlock({
  product,
  size = "md",
  className,
}: {
  product: Product;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const mounted = useHasMounted();
  const currency = usePreferences((s) => s.currency);
  const cur = mounted ? currency : "EUR";

  const perGram = formatPricePerActiveGramIn(
    product.priceCents,
    product.specs.activePerServingG,
    product.specs.servingsPerContainer,
    cur,
  );
  const off = discountPct(product.priceCents, product.compareAtPriceCents);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-wrap items-baseline gap-2">
        <Money
          cents={product.priceCents}
          className={cn("font-semibold text-accent", sizeMap[size])}
        />
        {product.compareAtPriceCents && (
          <Money
            cents={product.compareAtPriceCents}
            className="text-sm text-muted line-through"
          />
        )}
        {off && <Badge variant="danger">-{off}%</Badge>}
      </div>
      {perGram && (
        <p className="num text-xs text-muted">
          {perGram} di {product.specs.activeName.toLowerCase()}
        </p>
      )}
    </div>
  );
}
