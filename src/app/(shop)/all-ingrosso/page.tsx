import type { Metadata } from "next";
import { Send } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "All'ingrosso",
  description: `Ordini all'ingrosso e dropshipping con ${SITE.name}.`,
};

export default function AllIngrossoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Business
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        All&apos;ingrosso
      </h1>

      <div className="mt-6 flex flex-col gap-4 text-pretty text-muted">
        <p>
          Offriamo condizioni dedicate per <strong className="text-text">ordini
          all&apos;ingrosso</strong> e <strong className="text-text">dropshipping</strong>.
          Più aumenta il volume, più il prezzo per unità scende.
        </p>
        <p>
          Per il listino all&apos;ingrosso e per attivare una collaborazione,
          scrivici su Telegram: valutiamo insieme quantità, logistica e
          modalità di pagamento.
        </p>
      </div>

      <a
        href={SITE.telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-base bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent/90"
      >
        <Send className="size-4" aria-hidden />
        Richiedi il listino all&apos;ingrosso
      </a>

      <p className="mt-8 text-sm italic text-muted">
        (Testo segnaposto: aggiorna con le tue condizioni reali per l&apos;ingrosso.)
      </p>
    </div>
  );
}
