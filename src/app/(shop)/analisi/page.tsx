import type { Metadata } from "next";
import { FileCheck2, FlaskConical, PackageCheck, ScrollText } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { listProducts } from "@/features/products";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analisi di laboratorio",
  description:
    "Come testiamo ogni lotto e dove trovare i referti con il numero di batch.",
};

const STEPS = [
  {
    icon: PackageCheck,
    title: "Prelievo",
    body: "Da ogni lotto di produzione preleviamo campioni casuali prima della messa in vendita.",
  },
  {
    icon: FlaskConical,
    title: "Analisi indipendente",
    body: "Un laboratorio di terza parte misura il contenuto reale e cerca i contaminanti.",
  },
  {
    icon: ScrollText,
    title: "Referto pubblico",
    body: "Pubblichiamo il certificato con il numero di lotto, così puoi verificarlo.",
  },
];

export default function AnalisiPage() {
  const batches = listProducts()
    .filter((p) => p.labReport)
    .map((p) => ({ product: p.title, report: p.labReport! }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Quality control"
        title="Ogni lotto, analizzato"
        description="La dose dichiarata in etichetta deve corrispondere a quella nel barattolo. Lo verifichiamo e lo documentiamo."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.title} className="rounded-base border border-border p-5">
            <span className="grid size-10 place-items-center rounded-base border border-border text-accent">
              <s.icon className="size-5" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-medium">{s.title}</p>
            <p className="mt-1 text-sm text-muted">{s.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-lg font-semibold tracking-tight">
        Referti recenti
      </h2>
      <div className="mt-4 overflow-x-auto rounded-base border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Prodotto</th>
              <th className="px-4 py-3 font-medium">Laboratorio</th>
              <th className="px-4 py-3 font-medium">Lotto</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 text-right font-medium">Referto</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(({ product, report }) => (
              <tr
                key={report.batch}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-medium">{product}</td>
                <td className="px-4 py-3 text-muted">{report.lab}</td>
                <td className="num px-4 py-3">{report.batch}</td>
                <td className="num px-4 py-3 text-muted">
                  {formatDate(report.testedOn)}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={report.documentUrl}
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    <FileCheck2 className="size-3.5" aria-hidden />
                    PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
