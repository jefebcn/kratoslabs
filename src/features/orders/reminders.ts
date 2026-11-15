import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { orderPreConfirmationEmail } from "@/lib/email/templates";
import { getSiteSettings } from "@/features/settings";
import { isBankComplete } from "@/lib/payments/bank";
import { DAY_MS, reminderDue } from "@/lib/payment-reminders";

/**
 * Promemoria automatici di pagamento per gli ordini con bonifico.
 *
 * Idonei: bonifico + non pagato + in attesa, creati negli ultimi
 * MAX_AGE_DAYS giorni (un ordine di mesi fa non riceve email a sorpresa).
 * Ogni ordine riceve al massimo due promemoria (tempi in reminderDue).
 * Gli invii sono registrati in `shipping.paymentReminders` (date ISO), così
 * rieseguire il controllo non manda mai la stessa email due volte.
 */

const MAX_AGE_DAYS = 14;
/** Tetto per esecuzione: con la pausa tra invii resta sotto il minuto. */
const MAX_PER_RUN = 60;

export interface ReminderRunResult {
  ok: boolean;
  /** Promemoria inviati in questa esecuzione, per riferimento ordine. */
  sent: string[];
  failed: string[];
  /** Ordini idonei per cui non è ancora il momento (o già serviti). */
  waiting: number;
  message?: string;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function time(v: unknown): number {
  const t = Date.parse(String(v ?? ""));
  return Number.isFinite(t) ? t : 0;
}

export async function runPaymentReminders(
  now = Date.now(),
): Promise<ReminderRunResult> {
  const empty = { sent: [], failed: [], waiting: 0 };
  const admin = createAdminClient();
  if (!admin) return { ok: false, ...empty, message: "Database non configurato." };
  if (!isEmailConfigured) {
    return { ok: false, ...empty, message: "Email non configurata (Resend)." };
  }

  const { bank, reminders } = await getSiteSettings();
  if (!reminders.enabled) {
    return { ok: true, ...empty, message: "Promemoria disattivati nelle impostazioni." };
  }
  if (!isBankComplete(bank)) {
    return { ok: false, ...empty, message: "IBAN o intestatario mancanti nelle impostazioni." };
  }

  const since = new Date(now - MAX_AGE_DAYS * DAY_MS).toISOString();
  const { data, error } = await admin
    .from("orders")
    .select("id, reference, customer_email, total_cents, created_at, shipping")
    .eq("payment_method", "bank")
    .eq("payment_status", "unpaid")
    .eq("status", "pending")
    .gte("created_at", since)
    .order("created_at", { ascending: true });
  if (error || !data) {
    return { ok: false, ...empty, message: "Lettura ordini non riuscita." };
  }

  const sent: string[] = [];
  const failed: string[] = [];
  let waiting = 0;

  for (const row of data) {
    const reference = String(row.reference ?? "");
    const to = String(row.customer_email ?? "").trim();
    const shipping = (row.shipping as Record<string, unknown>) ?? {};
    const history = Array.isArray(shipping.paymentReminders)
      ? (shipping.paymentReminders as unknown[]).map(String)
      : [];
    const created = time(row.created_at);
    const variant = reminderDue(
      {
        created,
        sent: history.map(time),
        resentAt: time(shipping.bankDetailsResentAt),
      },
      reminders,
      now,
    );

    if (!variant || !to || !created) {
      waiting++;
      continue;
    }
    if (sent.length + failed.length >= MAX_PER_RUN) {
      waiting++;
      continue;
    }

    const { subject, html, text } = orderPreConfirmationEmail({
      reference,
      paymentMethod: "bank",
      totalCents: Number(row.total_cents ?? 0),
      bank,
      variant,
      locale: typeof shipping.locale === "string" ? shipping.locale : null,
    });
    // Resend accetta poche richieste al secondo: si va uno alla volta.
    if (sent.length + failed.length > 0) await wait(600);
    if (await sendEmail({ to, subject, html, text })) {
      sent.push(reference);
      await admin
        .from("orders")
        .update({
          shipping: {
            ...shipping,
            paymentReminders: [...history, new Date(now).toISOString()],
          },
        })
        .eq("id", String(row.id));
    } else {
      failed.push(reference);
    }
  }

  if (sent.length || failed.length) {
    console.log(
      `[payment-reminders] inviati: ${sent.join(", ") || "-"} · non inviati: ${failed.join(", ") || "-"}`,
    );
  }
  return { ok: failed.length === 0, sent, failed, waiting };
}
