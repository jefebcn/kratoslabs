"use client";

import Link from "next/link";
import { Bitcoin, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyRow } from "@/components/checkout/CopyRow";
import { formatPrice } from "@/lib/utils";
import {
  CRYPTO_ASSETS,
  isCryptoConfigured,
  bitcoinUri,
} from "@/lib/payments/crypto";

export function CryptoPayment({
  reference,
  totalCents,
  emailSent,
}: {
  reference: string;
  totalCents?: number;
  emailSent?: boolean;
}) {
  return (
    <div className="rounded-base border border-accent/30 bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full border border-accent/30 text-accent">
          <Bitcoin className="size-6" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold uppercase tracking-tight">
            Paga in criptovaluta
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
            Riferimento ordine
          </dt>
          <dd className="num mt-0.5 font-semibold">{reference}</dd>
        </div>
        {typeof totalCents === "number" && (
          <div className="sm:text-right">
            <dt className="text-xs uppercase tracking-wide text-muted">
              Totale da pagare
            </dt>
            <dd className="num mt-0.5 font-semibold">
              {formatPrice(totalCents)}
            </dd>
          </div>
        )}
      </dl>

      {isCryptoConfigured ? (
        <>
          <p className="mt-6 text-sm text-muted">
            Invia l&apos;equivalente dell&apos;importo a uno degli indirizzi qui
            sotto, indicando il riferimento come nota.
          </p>

          <div className="mt-4 flex flex-col gap-4">
            {CRYPTO_ASSETS.map((a) => (
              <div key={a.symbol}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    {a.label}{" "}
                    <span className="text-muted">({a.symbol})</span>
                  </p>
                  {a.network && (
                    <span className="rounded-base border border-border px-1.5 py-0.5 text-[11px] text-muted">
                      Rete: {a.network}
                    </span>
                  )}
                </div>
                <div className="mt-1.5">
                  <CopyRow value={a.address} />
                </div>
                {a.symbol === "BTC" && (
                  <a
                    href={bitcoinUri(a.address, `Kratos Labs ${reference}`)}
                    className="mt-1.5 inline-block text-xs font-medium text-accent hover:underline"
                  >
                    Apri nel wallet →
                  </a>
                )}
              </div>
            ))}
          </div>

          <p className="mt-5 rounded-base border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
            Invia l&apos;importo <span className="text-text">esatto</span> e usa
            il riferimento <span className="num text-text">{reference}</span>{" "}
            come nota. Reti diverse da quelle indicate = fondi persi.
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-base border border-border bg-surface-2 p-4 text-sm text-muted">
          Il pagamento in criptovaluta è in fase di attivazione. Ti
          contatteremo via email con l&apos;indirizzo per completare
          l&apos;ordine <span className="num text-text">{reference}</span>.
        </div>
      )}

      {/* Flusso ordine: pre-conferma email -> verifica -> conferma */}
      <div className="mt-6 flex items-start gap-2.5 rounded-base border border-border p-3 text-sm text-muted">
        <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        <p>
          {emailSent
            ? "Ti abbiamo inviato un'email di pre-conferma. "
            : null}
          L&apos;ordine viene <span className="text-text">confermato</span> dopo
          che verifichiamo la ricezione del pagamento: riceverai una seconda
          email con la conferma.
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
