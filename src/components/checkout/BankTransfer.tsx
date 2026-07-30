"use client";

import Link from "next/link";
import { Landmark, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyRow } from "@/components/checkout/CopyRow";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { BANK, isBankConfigured, formatIban } from "@/lib/payments/bank";

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
}: {
  reference: string;
  totalCents?: number;
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

      {isBankConfigured ? (
        <>
          <p className="mt-6 text-sm text-muted">
            Esegui il bonifico con i dati qui sotto, indicando{" "}
            <span className="text-text">obbligatoriamente</span> la causale.
            L&apos;ordine passa a <span className="text-text">pagato</span> alla
            ricezione del bonifico (1–3 giorni lavorativi).
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <Row label="Intestatario" value={BANK.holder} />
            <Row label="IBAN" value={formatIban(BANK.iban)} />
            {BANK.bic && <Row label="BIC / SWIFT" value={BANK.bic} />}
            {BANK.bank && <Row label="Banca" value={BANK.bank} />}
            <Row label="Causale" value={reference} />
          </div>

          <p className="mt-5 rounded-base border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
            Senza la causale <span className="num text-text">{reference}</span>{" "}
            non riusciamo ad abbinare il pagamento all&apos;ordine.
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-base border border-border bg-surface-2 p-4 text-sm text-muted">
          Il pagamento con bonifico è in fase di attivazione. Per completare
          l&apos;ordine <span className="num text-text">{reference}</span>,
          contattaci e ti inviamo le coordinate bancarie.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <a href={SITE.telegramUrl} target="_blank" rel="noopener noreferrer">
            <Send className="size-4" aria-hidden />
            Conferma su Telegram
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Continua lo shopping</Link>
        </Button>
      </div>
    </div>
  );
}
