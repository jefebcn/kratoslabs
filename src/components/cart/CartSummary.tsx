"use client";

import { Money } from "@/components/ui/money";
import { Separator } from "@/components/ui/separator";
import { useCartSummary } from "@/features/cart";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  SHIPPING_FLAT_CENTS,
} from "@/lib/constants";

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
  const { subtotalGrossCents, subtotalNetCents, discountCents } =
    useCartSummary();

  const empty = subtotalNetCents === 0;
  const freeShipping = subtotalNetCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = empty || freeShipping ? 0 : SHIPPING_FLAT_CENTS;
  const totalCents = subtotalNetCents + shippingCents;

  return (
    <div className="flex flex-col gap-2">
      <Row label="Subtotale" muted>
        <Money cents={subtotalGrossCents} />
      </Row>

      {discountCents > 0 && (
        <Row label="Sconto quantità" muted>
          <span className="text-accent">
            −<Money cents={discountCents} />
          </span>
        </Row>
      )}

      <Row label="Spedizione" muted>
        {shippingCents === 0 ? (
          <span className="text-accent">Gratuita</span>
        ) : (
          <Money cents={shippingCents} />
        )}
      </Row>

      <Separator className="my-1" />

      <Row label="Totale">
        <Money cents={totalCents} className="text-base text-accent" />
      </Row>

      {!empty && !freeShipping && (
        <p className="text-xs text-muted">
          Aggiungi{" "}
          <Money cents={FREE_SHIPPING_THRESHOLD_CENTS - subtotalNetCents} /> per
          la spedizione gratuita.
        </p>
      )}
    </div>
  );
}
