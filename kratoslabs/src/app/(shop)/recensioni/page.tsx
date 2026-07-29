import type { Metadata } from "next";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Recensioni",
  description: "Cosa dicono i clienti KratosLabs.",
};

// Contenuto mock, da sostituire con recensioni verificate.
const REVIEWS = [
  {
    author: "Marco R.",
    rating: 5,
    product: "ISO Zero",
    title: "Dosaggi reali",
    body: "Il referto combacia con l'etichetta. Sapore neutro, si scioglie bene.",
  },
  {
    author: "Sara T.",
    rating: 5,
    product: "Creatina",
    title: "Essenziale e pulita",
    body: "Nessun additivo, purezza dichiarata e certificata. Ricompro.",
  },
  {
    author: "Luca B.",
    rating: 4,
    product: "Ignition",
    title: "Formula onesta",
    body: "Etichetta aperta, dosaggi pieni. Avrei voluto più gusti.",
  },
  {
    author: "Giulia M.",
    rating: 5,
    product: "Omega-3",
    title: "Trasparenza totale",
    body: "Test su metalli pesanti pubblicati. È il motivo per cui ho scelto qui.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} su 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < n ? "fill-accent text-accent" : "text-border",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const avg =
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Recensioni"
        title="La parola ai clienti"
        description="Valutazioni raccolte dopo l'acquisto."
      />

      <div className="mt-6 flex items-center gap-4">
        <span className="num text-3xl font-semibold text-accent">
          {avg.toFixed(1).replace(".", ",")}
        </span>
        <div>
          <Stars n={Math.round(avg)} />
          <p className="num mt-1 text-xs text-muted">
            su {REVIEWS.length} recensioni
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {REVIEWS.map((r) => (
          <Card key={r.author}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Stars n={r.rating} />
                <span className="text-xs text-muted">{r.product}</span>
              </div>
              <p className="mt-2 text-sm font-medium">{r.title}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted">{r.body}</p>
              <p className="mt-3 text-xs text-muted">— {r.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
