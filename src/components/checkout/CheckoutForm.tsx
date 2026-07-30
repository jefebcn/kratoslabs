"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/ui/icon";
import { CryptoPayment } from "@/components/checkout/CryptoPayment";
import { createOrder, type CheckoutResult } from "@/features/checkout";
import { useCart } from "@/features/cart";
import { PAYMENT_METHODS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

export function CheckoutForm() {
  const [state, action, pending] = useActionState<CheckoutResult | null, FormData>(
    createOrder,
    null,
  );
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const empty = lines.length === 0;

  // Congela il totale al momento della conferma, prima di svuotare il carrello.
  const [orderTotalCents, setOrderTotalCents] = useState<number | null>(null);

  useEffect(() => {
    if (state?.ok && orderTotalCents === null) {
      setOrderTotalCents(
        lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0),
      );
      clear();
    }
  }, [state?.ok, orderTotalCents, lines, clear]);

  if (state?.ok && state.reference) {
    if (state.paymentMethod === "crypto") {
      return (
        <CryptoPayment
          reference={state.reference}
          totalCents={orderTotalCents ?? undefined}
        />
      );
    }
    return (
      <div className="rounded-base border border-emerald-500/40 bg-surface p-8 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full border border-emerald-500/40 text-emerald-600">
          <Check className="size-6" aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Ordine confermato</h2>
        <p className="mt-1 text-sm text-muted">
          Riferimento{" "}
          <span className="num text-text">{state.reference}</span>. Ti abbiamo
          inviato una email di conferma.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/products">Continua lo shopping</Link>
        </Button>
      </div>
    );
  }

  const err = (k: string) => state?.errors?.[k]?.[0];

  return (
    <form action={action} className="flex flex-col gap-6">
      {state?.message && (
        <div className="rounded-base border border-danger/50 px-4 py-3 text-sm text-danger">
          {state.message}
        </div>
      )}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-medium">
          Contatti e spedizione
        </legend>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          error={err("email")}
          className="sm:col-span-2"
        />
        <Field
          label="Nome"
          name="firstName"
          autoComplete="given-name"
          error={err("firstName")}
        />
        <Field
          label="Cognome"
          name="lastName"
          autoComplete="family-name"
          error={err("lastName")}
        />
        <Field
          label="Indirizzo"
          name="address"
          autoComplete="address-line1"
          error={err("address")}
          className="sm:col-span-2"
        />
        <Field
          label="Città"
          name="city"
          autoComplete="address-level2"
          error={err("city")}
        />
        <Field
          label="CAP"
          name="postalCode"
          autoComplete="postal-code"
          error={err("postalCode")}
        />
        <Field
          label="Paese"
          name="country"
          autoComplete="country-name"
          error={err("country")}
          className="sm:col-span-2"
        />
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Pagamento</legend>
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
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Note (opzionale)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Istruzioni per la consegna…"
        />
      </div>

      <Button type="submit" size="lg" loading={pending} disabled={empty}>
        {empty ? "Carrello vuoto" : "Conferma ordine"}
      </Button>
      <p className="text-xs text-muted">
        Con pagamento in criptovaluta, dopo la conferma vedrai l&apos;indirizzo
        dove inviare i fondi e il riferimento dell&apos;ordine.
      </p>
    </form>
  );
}
