"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/ui/icon";
import { CryptoPayment } from "@/components/checkout/CryptoPayment";
import { BankTransfer } from "@/components/checkout/BankTransfer";
import { createOrder, type CheckoutResult } from "@/features/checkout";
import { useCart } from "@/features/cart";
import { priceLine } from "@/features/products/pricing";
import { PAYMENT_METHODS } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import {
  maxRedeemablePoints,
  discountCentsFor,
  pointsValueCents,
} from "@/lib/rewards";
import type { BankConfig } from "@/lib/payments/bank";
import type { CryptoAsset } from "@/lib/payments/crypto";

export interface CheckoutPayment {
  bank: BankConfig;
  assets: CryptoAsset[];
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  error,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function CheckoutForm({
  payment,
  points = 0,
}: {
  payment: CheckoutPayment;
  points?: number;
}) {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const [state, action, pending] = useActionState<CheckoutResult | null, FormData>(
    createOrder,
    null,
  );
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const empty = lines.length === 0;
  const [usePoints, setUsePoints] = useState(false);

  // Totale netto (sconti quantità inclusi): stesso valore mostrato nel riepilogo.
  const netTotalCents = lines.reduce(
    (sum, l) => sum + priceLine(l.unitPriceCents, l.quantity).netCents,
    0,
  );

  // Punti spendibili su questo carrello e sconto risultante.
  const redeemable = maxRedeemablePoints(points, netTotalCents);
  const appliedPoints = usePoints ? redeemable : 0;
  const discountCents = discountCentsFor(appliedPoints);
  const payableCents = Math.max(0, netTotalCents - discountCents);

  // Congela il totale al momento della conferma, prima di svuotare il carrello.
  const [orderTotalCents, setOrderTotalCents] = useState<number | null>(null);

  useEffect(() => {
    if (state?.ok && orderTotalCents === null) {
      setOrderTotalCents(netTotalCents);
      clear();
    }
  }, [state?.ok, orderTotalCents, netTotalCents, clear]);

  if (state?.ok && state.reference) {
    const paidCents = state.totalCents ?? orderTotalCents ?? undefined;
    if (state.paymentMethod === "crypto") {
      return (
        <CryptoPayment
          reference={state.reference}
          totalCents={paidCents}
          emailSent={state.emailSent}
          assets={payment.assets}
        />
      );
    }
    if (state.paymentMethod === "bank") {
      return (
        <BankTransfer
          reference={state.reference}
          totalCents={paidCents}
          emailSent={state.emailSent}
          bank={payment.bank}
        />
      );
    }
    return (
      <div className="rounded-base border border-emerald-500/40 bg-surface p-8 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full border border-emerald-500/40 text-emerald-600">
          <Check className="size-6" aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-semibold">{t("orderReceived")}</h2>
        <p className="mt-1 text-sm text-muted">
          {t("reference")}{" "}
          <span className="num text-text">{state.reference}</span>.
          {state.emailSent ? " " + t("emailPreconfirm") : ""}{" "}
          {t("confirmedAfterPayment")}
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/products">{tCart("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  const err = (k: string) => state?.errors?.[k]?.[0];

  return (
    <form action={action} className="flex flex-col gap-6">
      {/* Snapshot del carrello inviato al server per persistere l'ordine. */}
      <input
        type="hidden"
        name="lines"
        value={JSON.stringify(
          lines.map((l) => ({
            productId: l.productId,
            slug: l.slug,
            title: l.title,
            brand: l.brand,
            imageUrl: l.imageUrl,
            unitPriceCents: l.unitPriceCents,
            quantity: l.quantity,
          })),
        )}
      />
      <input type="hidden" name="totalCents" value={netTotalCents} />
      <input type="hidden" name="redeemPoints" value={appliedPoints} />

      {redeemable > 0 && (
        <div className="rounded-base border border-accent/30 bg-accent-soft/40 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={usePoints}
              onChange={(e) => setUsePoints(e.target.checked)}
              className="mt-0.5 [accent-color:#dc2626]"
            />
            <span className="text-sm">
              <span className="font-semibold">
                {t("rewards.use", {
                  points: redeemable,
                  value: formatPrice(discountCentsFor(redeemable)),
                })}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {t("rewards.balance", {
                  points,
                  value: formatPrice(pointsValueCents(points)),
                })}
              </span>
            </span>
          </label>
          {appliedPoints > 0 && (
            <dl className="mt-3 space-y-1 border-t border-accent/20 pt-3 text-sm">
              <div className="flex justify-between text-muted">
                <dt>{t("rewards.subtotal")}</dt>
                <dd className="num">{formatPrice(netTotalCents)}</dd>
              </div>
              <div className="flex justify-between text-accent">
                <dt>{t("rewards.discount")}</dt>
                <dd className="num">−{formatPrice(discountCents)}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>{t("rewards.toPay")}</dt>
                <dd className="num">{formatPrice(payableCents)}</dd>
              </div>
            </dl>
          )}
        </div>
      )}

      {state?.message && (
        <div className="rounded-base border border-danger/50 px-4 py-3 text-sm text-danger">
          {state.message}
        </div>
      )}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-medium">
          {t("contactShipping")}
        </legend>
        <Field
          label={t("email")}
          name="email"
          type="email"
          autoComplete="email"
          error={err("email")}
          className="sm:col-span-2"
        />
        <Field
          label={t("firstName")}
          name="firstName"
          autoComplete="given-name"
          error={err("firstName")}
        />
        <Field
          label={t("lastName")}
          name="lastName"
          autoComplete="family-name"
          error={err("lastName")}
        />
        <Field
          label={t("address")}
          name="address"
          autoComplete="address-line1"
          error={err("address")}
          className="sm:col-span-2"
        />
        <Field
          label={t("city")}
          name="city"
          autoComplete="address-level2"
          error={err("city")}
        />
        <Field
          label={t("postalCode")}
          name="postalCode"
          autoComplete="postal-code"
          error={err("postalCode")}
        />
        <Field
          label={t("country")}
          name="country"
          autoComplete="country-name"
          error={err("country")}
          className="sm:col-span-2"
        />
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">{t("payment")}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className="flex cursor-pointer items-center gap-3 rounded-base border border-border p-3 text-sm transition-colors has-[:checked]:border-accent has-[:checked]:text-accent"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                defaultChecked={m.id === "crypto"}
                className="[accent-color:#dc2626]"
              />
              <Icon name={m.icon} className="size-4" />
              {t(`pm.${m.id}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">{t("notesOptional")}</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder={t("notesPlaceholder")}
        />
      </div>

      <Button type="submit" size="lg" loading={pending} disabled={empty}>
        {empty ? t("cartEmpty") : t("confirmOrder")}
      </Button>
      <p className="text-xs text-muted">{t("cryptoHint")}</p>
    </form>
  );
}
