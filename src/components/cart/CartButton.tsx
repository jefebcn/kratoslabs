"use client";

import { ShoppingBag } from "lucide-react";
import { useCart, useCartCount } from "@/features/cart";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const open = useCart((s) => s.open);
  const count = useCartCount();
  const mounted = useHasMounted();
  const showCount = mounted && count > 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={showCount ? `Apri carrello, ${count} articoli` : "Apri carrello"}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-base text-text transition-colors hover:bg-surface-2",
        className,
      )}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {showCount && (
        <span className="num absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-bg">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
