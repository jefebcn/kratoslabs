import Link from "next/link";
import { Tag, Truck, Lock, ArrowRight } from "lucide-react";

/**
 * Tre riquadri informativi in home: cosa trattiamo, spedizione, pagamenti.
 * Contenuto reale KratosLabs (prodotti Deus Medical; pagamenti attivi).
 */
export function HomeInfoCards() {
  const cards = [
    {
      icon: Tag,
      title: "Cosa trattiamo",
      body: (
        <>
          <span className="font-medium text-text">Iniettabili</span>,{" "}
          <span className="font-medium text-text">Orali</span>,{" "}
          <span className="font-medium text-text">PCT</span>,{" "}
          <span className="font-medium text-text">HGH &amp; Peptidi</span>,{" "}
          <span className="font-medium text-text">SARMs</span> e{" "}
          <span className="font-medium text-text">Brucia grassi</span> — tutti
          prodotti <span className="font-medium text-text">Deus Medical</span>.
        </>
      ),
      cta: { label: "Sfoglia tutti i prodotti", href: "/products" },
    },
    {
      icon: Truck,
      title: "Spedizione e consegna",
      body: (
        <>
          Spedizione entro 3 giorni lavorativi dal pagamento. Imballo{" "}
          <span className="font-medium text-text">anonimo</span>, senza etichette
          identificative, con <span className="font-medium text-text">tracciamento</span>{" "}
          su ogni ordine. Consegna in 5–28 giorni.
        </>
      ),
      cta: { label: "Spedizioni e resi", href: "/legal/shipping-and-returns" },
    },
    {
      icon: Lock,
      title: "Metodi di pagamento",
      body: (
        <>
          <span className="font-medium text-text">Bonifico bancario</span>,{" "}
          <span className="font-medium text-text">Bitcoin</span> e{" "}
          <span className="font-medium text-text">USDT (TRC-20)</span>. Dati
          trattati con la massima riservatezza.
        </>
      ),
      cta: { label: "Guida ai pagamenti", href: "/guida-pagamenti" },
    },
  ];

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="flex flex-col rounded-base border border-border bg-surface-2/40 p-6 text-center"
          >
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
              <c.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.15em] text-accent">
              {c.title}
            </h3>
            <p className="mt-3 flex-1 text-sm text-muted">{c.body}</p>
            <Link
              href={c.cta.href}
              className="mt-4 inline-flex items-center justify-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              {c.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
