import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: `Chi siamo: la missione e i valori di ${SITE.name}.`,
};

export default function ChiSiamoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {SITE.name}
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        Chi siamo
      </h1>

      <div className="mt-6 flex flex-col gap-4 text-pretty text-muted">
        <p>
          {SITE.name} nasce con un obiettivo semplice: offrire prodotti con{" "}
          <strong className="text-text">dosaggi dichiarati</strong> e qualità
          verificabile, senza promesse che non possiamo dimostrare.
        </p>
        <p>
          Lavoriamo con distributori ufficiali e selezioniamo ogni referenza in
          base a purezza e affidabilità. Ci teniamo alla trasparenza: quello che
          leggi in etichetta è quello che trovi nel prodotto.
        </p>
        <p>
          Il nostro team è raggiungibile ogni giorno tramite Telegram per
          consigli, tracciamento degli ordini e assistenza post-vendita.
        </p>
        <p className="text-sm italic">
          (Testo segnaposto: personalizza questa pagina con la storia e i valori
          del tuo brand.)
        </p>
      </div>
    </div>
  );
}
