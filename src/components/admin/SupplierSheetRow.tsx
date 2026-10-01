"use client";

import { useState } from "react";
import { Check, ClipboardCopy, TriangleAlert } from "lucide-react";
import { SUPPLIER_HEADERS } from "@/lib/supplier-sheet";
import { cn } from "@/lib/utils";

/**
 * Anteprima e copia delle righe per il foglio del fornitore.
 *
 * Le righe arrivano già calcolate dal server (`supplierRows`); qui si mostra
 * cosa verrà incollato e lo si copia negli appunti come testo separato da
 * tabulazioni, che Google Sheets distribuisce una cella per valore.
 */
export function SupplierSheetRow({
  rows,
  tsv,
  warnings,
}: {
  rows: string[][];
  tsv: string;
  warnings: string[];
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(tsv);
      setState("copied");
    } catch {
      // Appunti non disponibili (permessi, contesto non sicuro): l'anteprima
      // resta selezionabile a mano.
      setState("error");
    }
    setTimeout(() => setState("idle"), 2500);
  }

  if (rows.length === 0) return null;

  return (
    // `w-0 min-w-full`: occupa l'intera cella ma non ne impone la larghezza.
    // Senza, l'anteprima (larga) allargava tutta la tabella ordini e spingeva
    // la colonna Stato/azioni fuori dal bordo; così scorre al suo interno.
    <details className="group w-0 min-w-full rounded-base border border-border bg-surface-2/40">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted hover:text-text">
        <span>
          Foglio fornitore · {rows.length} {rows.length === 1 ? "riga" : "righe"}
          {warnings.length > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 normal-case tracking-normal text-amber-600">
              <TriangleAlert className="size-3.5" aria-hidden />
              da controllare
            </span>
          )}
        </span>
        <span className="text-[11px] normal-case tracking-normal group-open:hidden">
          mostra
        </span>
      </summary>

      <div className="flex flex-col gap-3 border-t border-border px-3 py-3">
        {warnings.length > 0 && (
          <ul className="flex flex-col gap-1 rounded-base border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
            {warnings.map((w) => (
              <li key={w} className="flex gap-1.5">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                {w}
              </li>
            ))}
          </ul>
        )}

        <div className="overflow-x-auto">
          <table className="border-collapse font-mono text-[11px]">
            <thead>
              <tr>
                {SUPPLIER_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="border border-border bg-surface px-1.5 py-1 text-left font-medium text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td
                      key={j}
                      className={cn(
                        "whitespace-nowrap border border-border px-1.5 py-1",
                        !c && j !== 1 && "bg-amber-500/10",
                      )}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-base bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            {state === "copied" ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <ClipboardCopy className="size-4" aria-hidden />
            )}
            {state === "copied" ? "Copiato" : "Copia per il foglio"}
          </button>
          <p className="text-xs text-muted">
            {state === "error"
              ? "Copia non riuscita: seleziona la tabella a mano."
              : "Incolla nella colonna A (Date) della prima riga libera. Le colonne da N in poi restano alle formule del foglio."}
          </p>
        </div>
      </div>
    </details>
  );
}
