"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ShoppingBag } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import type { Product } from "@/types";

export function AddToCartButton({
  product,
  quantity = 1,
  label,
  variant = "primary",
  size = "md",
  className,
  iconClassName = "size-4",
}: {
  product: Product;
  quantity?: number;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  iconClassName?: string;
}) {
  const t = useTranslations("product");
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
      aria-label={soldOut ? t("soldOutAria") : t("addAria")}
    >
      {soldOut ? (
        t("soldOut")
      ) : added ? (
        <>
          <Check className={iconClassName} aria-hidden />
          {t("added")}
        </>
      ) : (
        <>
          <ShoppingBag className={iconClassName} aria-hidden />
          {label ?? t("addToCart")}
        </>
      )}
    </Button>
  );
}
