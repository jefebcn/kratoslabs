"use client";

import { useTranslations } from "next-intl";
import { Money } from "@/components/ui/money";
import { Separator } from "@/components/ui/separator";
import { useCartSummary } from "@/features/cart";

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

  // La spedizione dipende dal paese di destinazione: si calcola al checkout
  // (modello a zone, nessuna soglia gratuita). Il totale qui è la sola merce.
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
        <span className="text-xs text-muted">{t("shippingAtCheckout")}</span>
      </Row>

      <Separator className="my-1" />

      <Row label={t("total")}>
        <Money cents={subtotalNetCents} className="text-base text-accent" />
      </Row>
    </div>
  );
}
