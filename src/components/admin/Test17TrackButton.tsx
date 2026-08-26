"use client";

import { useActionState } from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { test17Track, type Track17Result } from "@/features/admin/actions";

/** Diagnostica 17TRACK: interroga un codice di prova e mostra l'esito. */
export function Test17TrackButton() {
  const [state, action, pending] = useActionState<
    Track17Result | null,
    FormData
  >(test17Track, null);

  return (
    <form
      action={action}
      className="rounded-base border border-border bg-surface p-4"
    >
      <p className="text-sm font-semibold">Diagnostica tracking (17TRACK)</p>
      <p className="mt-1 text-xs text-muted">
        Inserisci un codice di tracciamento reale per verificare che la API
        17TRACK sia configurata e funzionante (non serve un ordine).
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Input
          name="number"
          placeholder="Es. LX123456789IT"
          className="h-9 max-w-xs text-sm"
        />
        <Button
          type="submit"
          size="sm"
          variant="outline"
          loading={pending}
          className="gap-2"
        >
          <Truck className="size-4" aria-hidden /> Testa 17TRACK
        </Button>
      </div>
      {state && (
        <p
          className={`mt-2 text-xs ${state.ok ? "text-emerald-600" : "text-danger"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
