"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendTestEmail, type TestEmailResult } from "@/features/admin/actions";

/** Diagnostica Resend: invia un'email di test all'admin e mostra l'esito. */
export function TestEmailButton() {
  const [state, action, pending] = useActionState<
    TestEmailResult | null,
    FormData
  >(sendTestEmail, null);

  return (
    <form
      action={action}
      className="rounded-base border border-border bg-surface p-4"
    >
      <p className="text-sm font-semibold">Diagnostica email (Resend)</p>
      <p className="mt-1 text-xs text-muted">
        Invia un&apos;email di test al tuo indirizzo admin per verificare che
        Resend sia configurato e funzionante.
      </p>
      <Button
        type="submit"
        size="sm"
        variant="outline"
        loading={pending}
        className="mt-3 gap-2"
      >
        <Mail className="size-4" aria-hidden /> Invia email di test
      </Button>
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
