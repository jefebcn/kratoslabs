import type { Metadata } from "next";
import { Send, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contatto",
  description: `Contatta ${SITE.name}: Telegram ed email per ordini e assistenza.`,
};

export default function ContattoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Assistenza
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        Contatto
      </h1>
      <p className="mt-4 text-muted">
        Il modo più veloce per raggiungerci è Telegram: rispondiamo a domande su
        prodotti, ordini e spedizioni.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={SITE.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-base border border-border bg-surface p-4 transition-colors hover:border-accent"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Send className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold">Telegram</span>
            <span className="text-sm text-muted">Chat diretta e supporto</span>
          </span>
        </a>

        <a
          href={`mailto:${SITE.email}`}
          className="flex items-center gap-3 rounded-base border border-border bg-surface p-4 transition-colors hover:border-accent"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Mail className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold">Email</span>
            <span className="text-sm text-muted">{SITE.email}</span>
          </span>
        </a>
      </div>

      <p className="mt-8 text-sm italic text-muted">
        (Testo segnaposto: aggiorna qui i recapiti reali e gli orari di
        assistenza.)
      </p>
    </div>
  );
}
