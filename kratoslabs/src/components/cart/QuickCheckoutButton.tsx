"use client";

import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import type { Product } from "@/types";

/** Aggiunge il prodotto e porta dritto al checkout, senza aprire il drawer. */
export function QuickCheckoutButton({
  product,
  quantity = 1,
  variant = "outline",
  size = "md",
  iconOnly = false,
  className,
}: {
  product: Product;
  quantity?: number;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  iconOnly?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const close = useCart((s) => s.close);

  function handleClick() {
    add(product, quantity);
    close();
    router.push("/checkout");
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : size}
      className={className}
      disabled={product.stock <= 0}
      onClick={handleClick}
      title="Acquisto rapido"
      aria-label={`Acquisto rapido di ${product.title}`}
    >
      <Zap className="size-4" aria-hidden />
      {!iconOnly && "Quick checkout"}
    </Button>
  );
}
