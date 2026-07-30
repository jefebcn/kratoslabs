import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Guide",
  description: "Contenuti pratici su integrazione, dosaggi ed etichette.",
};

// Contenuto mock, da sostituire con articoli da CMS.
const GUIDES = [
  {
    tag: "Proteine",
    title: "Proteine: quante e quando",
    excerpt: "Fabbisogno reale, timing e differenze tra isolato e concentrato.",
  },
  {
    tag: "Creatina",
    title: "Creatina, istruzioni per l'uso",
    excerpt: "Dosaggio, fase di carico sì o no, cosa dice la letteratura.",
  },
  {
    tag: "Etichette",
    title: "Come leggere un'etichetta",
    excerpt: "Riconoscere un proprietary blend e i dosaggi sottosoglia.",
  },
  {
    tag: "Elettroliti",
    title: "Idratazione ed elettroliti",
    excerpt: "Quando servono davvero e in quali rapporti.",
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Guide"
        title="Capire prima di comprare"
        description="Contenuti pratici, senza promesse. Aggiornati quando cambia l'evidenza."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GUIDES.map((g) => (
          <Link key={g.title} href="/guide" className="block">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader>
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  {g.tag}
                </p>
                <CardTitle className="mt-1">{g.title}</CardTitle>
                <CardDescription>{g.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
