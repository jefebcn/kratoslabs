"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  iconClassName = "size-4",
}: {
  product: Product;
  quantity?: number;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  iconOnly?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  const router = useRouter();
  const t = useTranslations("product");
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
      title={t("quickCheckout")}
      aria-label={t("quickCheckout")}
    >
      <Zap className={iconClassName} aria-hidden />
      {!iconOnly && t("quickCheckout")}
    </Button>
  );
}
