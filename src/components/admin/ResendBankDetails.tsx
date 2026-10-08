"use client";

import { useState, useTransition } from "react";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  resendBankDetails,
  type ResendBankResult,
} from "@/features/orders/actions";

/**
 * Reinvio dei dati del bonifico ai clienti che non hanno ancora pagato.
 * Senza `orderId` agisce su tutti gli ordini idonei (`count`), altrimenti su
 * uno solo. Chiede conferma prima di inviare: le email partono subito.
 */
export function ResendBankDetails({
  orderId,
  count,
  compact = false,
}: {
  orderId?: string;
  count?: number;
  compact?: boolean;
}) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ResendBankResult | null>(null);

  function run() {
    const question = orderId
      ? "Rimandare a questo cliente l'email con i dati del bonifico?"
      : `Rimandare l'email con i dati del bonifico a ${count} clienti in attesa di pagamento?`;
    if (!window.confirm(question)) return;
    setResult(null);
    start(async () => setResult(await resendBankDetails(orderId)));
  }

  const summary = result
    ? result.message
      ? result.message
      : [
          `${result.sent} email inviate`,
          result.skipped ? `${result.skipped} saltate (già inviate da poco)` : "",
          result.failed.length ? `non inviate: ${result.failed.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join(" · ")
    : null;

  if (compact) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="inline-flex w-fit items-center gap-1 rounded-base border border-border px-2 py-1.5 text-xs font-medium transition-colors hover:text-accent disabled:opacity-50"
        >
          <Landmark className="size-3.5" aria-hidden />
          {pending ? "Invio…" : "Reinvia dati bonifico"}
        </button>
        {summary && (
          <span
            className={
              result?.ok ? "text-xs text-emerald-600" : "text-xs text-danger"
            }
          >
            {summary}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-base border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm">
        <p className="font-medium">Bonifici in attesa di pagamento: {count}</p>
        <p className="text-muted">
          Rimanda a ciascun cliente l&apos;email con IBAN, importo e causale del
          suo ordine.
        </p>
        {summary && (
          <p
            className={
              result?.ok ? "mt-1 text-emerald-600" : "mt-1 text-danger"
            }
          >
            {summary}
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={run}
        loading={pending}
        disabled={!count}
      >
        <Landmark className="size-4" aria-hidden />
        Reinvia dati bonifico
      </Button>
    </div>
  );
}
