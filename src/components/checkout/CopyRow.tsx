"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Riga con valore monospace + pulsante copia. Riusata dai pannelli di pagamento. */
export function CopyRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard non disponibile: il valore resta selezionabile a mano */
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-base border border-border bg-surface-2 p-2">
      <code className="min-w-0 flex-1 truncate font-mono text-xs">{value}</code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copia"
        className="inline-flex shrink-0 items-center gap-1 rounded-base border border-border bg-surface px-2 py-1 text-xs font-medium transition-colors hover:text-accent"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-accent" aria-hidden /> Copiato
          </>
        ) : (
          <>
            <Copy className="size-3.5" aria-hidden /> Copia
          </>
        )}
      </button>
    </div>
  );
}
