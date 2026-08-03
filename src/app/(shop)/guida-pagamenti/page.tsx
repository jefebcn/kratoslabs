import Link from "next/link";
import type { Metadata } from "next";
import {
  Landmark,
  Bitcoin,
  CircleDollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Guida ai pagamenti",
  description:
    "Come acquistare e pagare in sicurezza su KratosLabs: bonifico, Bitcoin e USDT.",
};

const METHODS = [
  {
    icon: Landmark,
    name: "Bonifico bancario (SEPA)",
    steps:
      "Dopo l'ordine ricevi via email tutte le coordinate. Il bonifico va effettuato in EUR tramite SEPA. Usa sempre la causale indicata (riferimento KL-…) e controlla le ultime coordinate ricevute.",
    confirm: "Conferma entro 24–48 ore dalla ricezione del pagamento.",
  },
  {
    icon: Bitcoin,
    name: "Bitcoin (BTC)",
    steps:
      "Al checkout compaiono l'indirizzo BTC, il QR e l'importo esatto da inviare. Invia dalla rete Bitcoin.",
    confirm: "Conferma di solito entro 1–2 giorni (in base alle conferme di rete).",
  },
  {
    icon: CircleDollarSign,
    name: "USDT (rete TRON / TRC-20)",
    steps:
      "Invia USDT all'indirizzo indicato usando la rete corretta: TRON (TRC-20). Inviare da un'altra rete comporta la perdita dei fondi.",
    confirm: "Conferma solitamente in pochi minuti.",
  },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-base border border-border bg-surface p-5">
      {children}
    </div>
  );
}

export default function PaymentGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {SITE.name}
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        Guida ai pagamenti
      </h1>
      <p className="mt-4 text-pretty text-muted">
        Pagare il tuo ordine è semplice e sicuro. Questa guida ti accompagna in
        ogni metodo di pagamento disponibile e in cosa aspettarti.
      </p>

      {/* Metodi disponibili */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-tight">
        Metodi disponibili
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        {METHODS.map((m) => (
          <Card key={m.name}>
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <m.icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-sm font-semibold">{m.name}</h3>
            </div>
            <p className="mt-3 text-sm text-muted">{m.steps}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
              <Clock className="size-3.5 text-accent" aria-hidden />
              {m.confirm}
            </p>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">
        Carta e PayPal non sono al momento disponibili: verranno attivati a
        breve.
      </p>

      {/* Problemi comuni */}
      <h2 className="mt-10 flex items-center gap-2 text-sm font-semibold uppercase tracking-tight">
        <AlertTriangle className="size-5 text-accent" aria-hidden />
        Problemi comuni
      </h2>
      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm text-muted">
        <li>
          <span className="font-medium text-text">Bonifico:</span> coordinate
          sbagliate o causale (riferimento) mancante.
        </li>
        <li>
          <span className="font-medium text-text">Bitcoin:</span> importo
          inferiore a quello richiesto.
        </li>
        <li>
          <span className="font-medium text-text">USDT:</span> rete sbagliata o
          importo insufficiente.
        </li>
      </ul>
      <p className="mt-4 rounded-base border border-accent/30 bg-accent-soft/40 px-4 py-3 text-sm">
        Se il tuo ordine risulta ancora non pagato, attendi fino a 2–3 giorni
        lavorativi. Se ci mette di più,{" "}
        <a
          href={SITE.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          contatta l&apos;assistenza
        </a>
        .
      </p>

      {/* Rimborsi / Sicurezza */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold">Rimborsi ed errori</h3>
          <p className="mt-2 text-sm text-muted">
            Al momento non offriamo rimborsi. Per problemi legati alla consegna
            fai riferimento alla{" "}
            <Link
              href="/legal/shipping-and-returns"
              className="text-accent hover:underline"
            >
              politica di spedizione
            </Link>
            .
          </p>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-accent" aria-hidden />
            Sicurezza
          </h3>
          <p className="mt-2 text-sm text-muted">
            Tutti i pagamenti sono gestiti in modo sicuro. Non conserviamo dati
            di pagamento sensibili; gli indirizzi crypto sono di sola ricezione.
            La tua privacy è rispettata.
          </p>
        </Card>
      </div>

      <p className="mt-8 text-sm text-muted">
        Hai domande?{" "}
        <a
          href={SITE.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          Contatta il nostro supporto
        </a>{" "}
        — siamo qui per aiutarti.
      </p>
    </div>
  );
}
