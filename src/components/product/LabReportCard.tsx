import Image from "next/image";
import { FileCheck2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { LabReport } from "@/types";

export function LabReportCard({ report }: { report?: LabReport }) {
  if (!report) {
    return (
      <div className="flex items-start gap-3 rounded-base border border-dashed border-border p-5 text-sm text-muted">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
        <p>
          Il referto del lotto in corso è in fase di pubblicazione. Ogni lotto è
          analizzato da un laboratorio indipendente prima della messa in vendita.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 rounded-base border border-border bg-surface p-5 sm:grid-cols-[140px_1fr]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-base border border-border bg-surface-2">
        <Image
          src="/images/coa.svg"
          alt={`Referto di analisi, lotto ${report.batch}`}
          fill
          sizes="140px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="success">
            <ShieldCheck className="size-3.5" aria-hidden />
            Verificato
          </Badge>
          <span className="text-sm text-muted">Analisi di terza parte</span>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-muted">Laboratorio</dt>
            <dd className="font-medium">{report.lab}</dd>
          </div>
          <div>
            <dt className="text-muted">Lotto</dt>
            <dd className="num font-medium">{report.batch}</dd>
          </div>
          <div>
            <dt className="text-muted">Data del test</dt>
            <dd className="num font-medium">{formatDate(report.testedOn)}</dd>
          </div>
        </dl>

        <a
          href={report.documentUrl}
          className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <FileCheck2 className="size-4" aria-hidden />
          Scarica il referto (PDF)
        </a>
      </div>
    </div>
  );
}
