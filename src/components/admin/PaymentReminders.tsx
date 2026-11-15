"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runRemindersNow } from "@/features/orders/actions";
import type { ReminderRunResult } from "@/features/orders/reminders";
import type { ReminderSettings } from "@/features/settings/types";

/**
 * Stato dei promemoria automatici di pagamento, con un pulsante per lanciare
 * subito il controllo giornaliero (manda solo i promemoria già dovuti).
 */
export function PaymentReminders({ settings }: { settings: ReminderSettings }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ReminderRunResult | null>(null);

  const summary = result
    ? result.message ??
      [
        result.sent.length
          ? `${result.sent.length} promemoria inviati (${result.sent.join(", ")})`
          : "Nessun promemoria dovuto adesso",
        result.failed.length ? `non inviati: ${result.failed.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  return (
    <div className="flex flex-col gap-3 rounded-base border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm">
        <p className="font-medium">
          Promemoria automatici:{" "}
          {settings.enabled ? (
            <span className="text-emerald-600">attivi</span>
          ) : (
            <span className="text-muted">disattivati</span>
          )}
        </p>
        <p className="text-muted">
          {settings.enabled
            ? `Ai bonifici non pagati: 1° dopo ${settings.firstAfterDays} ${settings.firstAfterDays === 1 ? "giorno" : "giorni"}, 2° e ultimo dopo ${settings.secondAfterDays} giorni. Controllo ogni mattina.`
            : "Nessuna email automatica ai clienti che non hanno pagato."}{" "}
          <Link href="/admin/settings" className="text-accent hover:underline">
            Modifica
          </Link>
        </p>
        {summary && (
          <p className={result?.ok ? "mt-1 text-emerald-600" : "mt-1 text-danger"}>
            {summary}
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        loading={pending}
        disabled={!settings.enabled}
        onClick={() => {
          setResult(null);
          start(async () => setResult(await runRemindersNow()));
        }}
      >
        <BellRing className="size-4" aria-hidden />
        Controlla ora
      </Button>
    </div>
  );
}
