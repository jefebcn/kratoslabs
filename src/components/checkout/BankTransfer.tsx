"use client";

import Link from "next/link";
import { Landmark, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyRow } from "@/components/checkout/CopyRow";
import { formatPrice } from "@/lib/utils";
import {
  formatIban,
  isBankComplete,
  type BankConfig,
} from "@/lib/payments/bank";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-1">
        <CopyRow value={value} />
      </div>
    </div>
  );
}

export function BankTransfer({
  reference,
  totalCents,
  emailSent,
  bank,
}: {
  reference: string;
  totalCents?: number;
  emailSent?: boolean;
  bank: BankConfig;
}) {
  return (
    <div className="rounded-base border border-accent/30 bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full border border-accent/30 text-accent">
          <Landmark className="size-6" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold uppercase tracking-tight">
            Paga con bonifico
          </h2>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Clock className="size-3.5" aria-hidden />
            In attesa di pagamento
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 rounded-base border border-border bg-surface-2 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">
            Causale (obbligatoria)
          </dt>
          <dd className="num mt-0.5 font-semibold">{reference}</dd>
        </div>
        {typeof totalCents === "number" && (
          <div className="sm:text-right">
            <dt className="text-xs uppercase tracking-wide text-muted">
              Importo del bonifico
            </dt>
            <dd className="num mt-0.5 font-semibold">
              {formatPrice(totalCents)}
            </dd>
          </div>
        )}
      </dl>

      {isBankComplete(bank) ? (
        <>
          <p className="mt-6 text-sm text-muted">
            Esegui il bonifico con i dati qui sotto, indicando{" "}
            <span className="text-text">obbligatoriamente</span> la causale.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <Row label="Intestatario" value={bank.holder} />
            <Row label="IBAN" value={formatIban(bank.iban)} />
            {bank.bic && <Row label="BIC / SWIFT" value={bank.bic} />}
            {bank.bank && <Row label="Banca" value={bank.bank} />}
            <Row label="Causale" value={reference} />
          </div>

          <p className="mt-5 rounded-base border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
            Senza la causale <span className="num text-text">{reference}</span>{" "}
            non riusciamo ad abbinare il pagamento all&apos;ordine.
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-base border border-border bg-surface-2 p-4 text-sm text-muted">
          Il pagamento con bonifico è in fase di attivazione. Ti contatteremo
          via email con le coordinate per completare l&apos;ordine{" "}
          <span className="num text-text">{reference}</span>.
        </div>
      )}

      {/* Flusso ordine: pre-conferma email -> ricezione bonifico -> conferma */}
      <div className="mt-6 flex items-start gap-2.5 rounded-base border border-border p-3 text-sm text-muted">
        <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        <p>
          {emailSent
            ? "Ti abbiamo inviato un'email di pre-conferma. "
            : null}
          Con bonifico la conferma dell&apos;ordine arriva{" "}
          <span className="text-text">entro 24–48 ore</span> dalla ricezione del
          pagamento: riceverai una seconda email con la conferma.
        </p>
      </div>

      <div className="mt-6">
        <Button asChild variant="outline">
          <Link href="/products">Continua lo shopping</Link>
        </Button>
      </div>
    </div>
  );
}
