"use client";

import { ShoppingCart } from "lucide-react";
import { useCart, useCartCount, useCartSummary } from "@/features/cart";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { cn, formatPrice } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const open = useCart((s) => s.open);
  const count = useCartCount();
  const { subtotalNetCents } = useCartSummary();
  const mounted = useHasMounted();
  // Prima dell'idratazione mostra valori neutri per evitare mismatch SSR.
  const c = mounted ? count : 0;
  const totalCents = mounted ? subtotalNetCents : 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Apri carrello, ${c} articoli`}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface py-1.5 pl-1.5 pr-1.5 text-sm font-medium text-text shadow-[0_0_0_3px_rgba(220,38,38,0.12),0_4px_14px_-4px_rgba(220,38,38,0.45)] transition-shadow hover:shadow-[0_0_0_3px_rgba(220,38,38,0.22),0_6px_18px_-4px_rgba(220,38,38,0.6)] sm:pl-4",
        className,
      )}
    >
      <span className="num hidden whitespace-nowrap sm:inline">
        {c} {c === 1 ? "prodotto" : "prodotti"} · {formatPrice(totalCents)}
      </span>
      <span className="relative grid size-8 place-items-center">
        <ShoppingCart className="size-5 text-accent" aria-hidden />
        <span className="num absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">
          {c > 99 ? "99+" : c}
        </span>
      </span>
    </button>
  );
}
