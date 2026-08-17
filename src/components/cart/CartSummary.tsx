"use client";

import { useTranslations } from "next-intl";
import { Money } from "@/components/ui/money";
import { Separator } from "@/components/ui/separator";
import { useCartSummary } from "@/features/cart";
import {
  shippingCentsFor,
  remainingForFreeShipping,
} from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

function Row({
  label,
  children,
  muted,
}: {
  label: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? "text-muted" : ""}>{label}</span>
      <span className={muted ? "text-muted" : "font-medium"}>{children}</span>
    </div>
  );
}

export function CartSummary() {
  const t = useTranslations("cart");
  const { subtotalGrossCents, subtotalNetCents, discountCents } =
    useCartSummary();

  // Spedizione a tariffa unica, gratuita sopra la soglia; calcolata sulla merce.
  const shippingCents = shippingCentsFor(subtotalNetCents);
  const freeShipping = shippingCents === 0;
  const missingForFree = remainingForFreeShipping(subtotalNetCents);
  const totalCents = subtotalNetCents + shippingCents;

  return (
    <div className="flex flex-col gap-2">
      <Row label={t("subtotal")} muted>
        <Money cents={subtotalGrossCents} />
      </Row>

      {discountCents > 0 && (
        <Row label={t("quantityDiscount")} muted>
          <span className="text-accent">
            −<Money cents={discountCents} />
          </span>
        </Row>
      )}

      <Row label={t("shipping")} muted>
        {freeShipping ? (
          <span className="font-medium text-emerald-600">
            {t("freeShipping")}
          </span>
        ) : (
          <Money cents={shippingCents} />
        )}
      </Row>

      {!freeShipping && missingForFree > 0 && (
        <p className="text-xs text-muted">
          {t("freeShippingProgress", { remaining: formatPrice(missingForFree) })}
        </p>
      )}

      <Separator className="my-1" />

      <Row label={t("total")}>
        <Money cents={totalCents} className="text-base text-accent" />
      </Row>
    </div>
  );
}
