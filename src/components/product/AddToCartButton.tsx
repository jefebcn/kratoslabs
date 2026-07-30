"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import type { Product } from "@/types";

export function AddToCartButton({
  product,
  quantity = 1,
  label = "Aggiungi",
  variant = "primary",
  size = "md",
  className,
}: {
  product: Product;
  quantity?: number;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  function handleClick() {
    add(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={soldOut}
      onClick={handleClick}
      aria-label={soldOut ? "Prodotto esaurito" : `Aggiungi ${product.title} al carrello`}
    >
      {soldOut ? (
        "Esaurito"
      ) : added ? (
        <>
          <Check className="size-4" aria-hidden />
          Aggiunto
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" aria-hidden />
          {label}
        </>
      )}
    </Button>
  );
}
