"use client";

import { useActionState } from "react";
import { DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importCatalog, type ActionResult } from "@/features/admin";
import { cn } from "@/lib/utils";

/** Pulsante che importa il catalogo Deus Medical con feedback di esito. */
export function ImportCatalogButton() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    importCatalog,
    null,
  );

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <Button type="submit" variant="outline" loading={pending}>
        <DownloadCloud className="size-4" aria-hidden />
        Importa catalogo Deus
      </Button>
      {state?.message && (
        <span
          className={cn(
            "text-xs",
            state.ok ? "text-emerald-600" : "text-danger",
          )}
        >
          {state.message}
        </span>
      )}
    </form>
  );
}
