"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveSettings, type SettingsResult } from "@/features/settings/actions";
import type { SiteSettings } from "@/features/settings/types";
import { cn } from "@/lib/utils";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-base border border-border bg-surface p-5">
      <h2 className="text-sm font-medium">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<
    SettingsResult | null,
    FormData
  >(saveSettings, null);

  const freeThresholdEuro =
    settings.shipping.freeThresholdCents != null
      ? (settings.shipping.freeThresholdCents / 100).toFixed(2)
      : "";

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-6">
      {state?.message && (
        <div
          className={cn(
            "rounded-base border px-4 py-3 text-sm",
            state.ok
              ? "border-emerald-500/40 text-emerald-600"
              : "border-danger/50 text-danger",
          )}
        >
          {state.message}
        </div>
      )}

      <Card
        title="Barra annunci"
        description="Una riga per messaggio. Scorrono in cima al sito."
      >
        <Field label="Messaggi">
          <Textarea
            name="announcements"
            rows={4}
            defaultValue={settings.announcements.join("\n")}
            placeholder={"Spedizione tracciata in 24/48h\nReso entro 30 giorni"}
          />
        </Field>
      </Card>

      <Card
        title="Bonifico bancario"
        description="Coordinate mostrate al cliente che paga con bonifico."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Intestatario">
            <Input name="bankHolder" defaultValue={settings.bank.holder} />
          </Field>
          <Field label="Banca">
            <Input name="bankName" defaultValue={settings.bank.bank} />
          </Field>
          <Field label="IBAN" hint="Senza spazi o con spazi: li rimuoviamo noi.">
            <Input name="bankIban" defaultValue={settings.bank.iban} />
          </Field>
          <Field label="BIC / SWIFT">
            <Input name="bankBic" defaultValue={settings.bank.bic} />
          </Field>
        </div>
      </Card>

      <Card
        title="Criptovalute"
        description="Indirizzi di ricezione. Lascia vuoto per nascondere un metodo."
      >
        <Field label="Indirizzo Bitcoin (BTC)">
          <Input name="btc" defaultValue={settings.crypto.btc} />
        </Field>
        <Field label="Indirizzo USDT — rete TRON (TRC-20)">
          <Input name="usdtTrc20" defaultValue={settings.crypto.usdtTrc20} />
        </Field>
      </Card>

      <Card title="Spedizione">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Soglia spedizione gratuita (€)"
            hint="Es. 59,90. Vuoto = nessuna soglia."
          >
            <Input
              name="freeThresholdEuro"
              inputMode="decimal"
              defaultValue={freeThresholdEuro}
              placeholder="59,90"
            />
          </Field>
          <Field label="Email dello store" hint="Per notifiche e contatti.">
            <Input
              name="storeEmail"
              type="email"
              defaultValue={settings.storeEmail}
              placeholder="ordini@kratoslabs.it"
            />
          </Field>
        </div>
        <Field label="Nota spedizione">
          <Input
            name="shippingNote"
            defaultValue={settings.shipping.note}
            placeholder="Consegna in 24/48h con corriere tracciato."
          />
        </Field>
      </Card>

      <div>
        <Button type="submit" loading={pending}>
          <Save className="size-4" aria-hidden />
          Salva impostazioni
        </Button>
      </div>
    </form>
  );
}
