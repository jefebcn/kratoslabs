"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminCaller } from "@/lib/auth/require-admin";
import { isEmailConfigured, sendEmail } from "@/lib/email/resend";
import {
  orderConfirmedEmail,
  orderPreConfirmationEmail,
  orderShippedEmail,
} from "@/lib/email/templates";
import { getSiteSettings } from "@/features/settings";
import { isBankComplete } from "@/lib/payments/bank";
import { registerTracking } from "@/lib/tracking";
import { addEntry, hasEntry, grantOnceBonus } from "@/features/rewards";
import { pointsEarnedFor, BONUS_FIRST_ORDER } from "@/lib/rewards";

const statusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  trackingId: z.string().optional(),
});

function refresh() {
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

/** Aggiorna stato e tracking di un ordine. */
export async function updateOrderStatus(formData: FormData): Promise<void> {
  if (!(await getAdminCaller())) return;
  const parsed = statusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
    trackingId: formData.get("trackingId") ?? undefined,
  });
  if (!parsed.success) return;

  const admin = createAdminClient();
  if (!admin) return;

  const patch: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.trackingId !== undefined) {
    patch.tracking_id = parsed.data.trackingId.trim() || null;
  }
  const { data: ord } = await admin
    .from("orders")
    .update(patch)
    .eq("id", parsed.data.orderId)
    .select("reference, user_id, points_redeemed, customer_email, tracking_id")
    .maybeSingle();

  // Se l'ordine viene annullato, restituisci al cliente i punti eventualmente
  // usati (una sola volta).
  if (parsed.data.status === "cancelled" && ord?.user_id) {
    const ref = String(ord.reference ?? "");
    const redeemed = Number(ord.points_redeemed ?? 0);
    if (redeemed > 0 && !(await hasEntry(admin, ref, "refund"))) {
      await addEntry(admin, String(ord.user_id), redeemed, "refund", ref);
    }
  }

  // Quando l'ordine passa a "spedito": registra il codice su 17TRACK (best-effort)
  // e invia l'email di spedizione con tracking.
  if (parsed.data.status === "shipped" && ord) {
    const trackingId = (ord.tracking_id as string | null) ?? null;
    if (trackingId) await registerTracking(trackingId);
    if (isEmailConfigured && ord.customer_email) {
      const { subject, html, text } = orderShippedEmail({
        reference: String(ord.reference ?? ""),
        trackingId,
      });
      await sendEmail({ to: String(ord.customer_email), subject, html, text });
    }
  }

  refresh();
}

/**
 * Conferma la ricezione del pagamento: segna l'ordine come pagato, lo porta in
 * lavorazione e invia l'email di conferma al cliente (se Resend è configurato).
 */
export async function confirmPayment(formData: FormData): Promise<void> {
  if (!(await getAdminCaller())) return;
  const orderId = String(formData.get("orderId") || "");
  if (!orderId) return;

  const admin = createAdminClient();
  if (!admin) return;

  const { data, error } = await admin
    .from("orders")
    .update({ payment_status: "paid", status: "processing" })
    .eq("id", orderId)
    .select("reference, customer_email, status, user_id, total_cents")
    .maybeSingle();

  if (!error && data) {
    // Accredita i punti guadagnati (5 ogni 25€), una sola volta per ordine.
    const ref = String(data.reference ?? "");
    if (data.user_id && ref && !(await hasEntry(admin, ref, "earn"))) {
      const earned = pointsEarnedFor(Number(data.total_cents ?? 0));
      if (earned > 0) {
        await addEntry(admin, String(data.user_id), earned, "earn", ref);
      }
      // Bonus primo ordine (una tantum per cliente).
      await grantOnceBonus(String(data.user_id), "bonus_first_order", BONUS_FIRST_ORDER);
    }
    if (isEmailConfigured) {
      const { subject, html, text } = orderConfirmedEmail({ reference: ref });
      await sendEmail({ to: String(data.customer_email), subject, html, text });
    }
  }
  refresh();
}

export interface ResendBankResult {
  ok: boolean;
  sent: number;
  failed: string[];
  skipped: number;
  message?: string;
}

/** Pausa minima tra due reinvii allo stesso ordine. */
const RESEND_COOLDOWN_MS = 10 * 60 * 1000;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Rimanda l'email con i dati del bonifico (IBAN, importo, causale) ai clienti
 * che hanno scelto il bonifico e non hanno ancora pagato. Senza `orderId`
 * agisce su tutti gli ordini idonei, altrimenti solo su quello indicato.
 *
 * Ogni cliente riceve la propria email (mai destinatari multipli). Un ordine
 * a cui i dati sono stati rimandati negli ultimi 10 minuti viene saltato, così
 * un doppio clic non produce email doppie.
 */
export async function resendBankDetails(
  orderId?: string,
): Promise<ResendBankResult> {
  const empty = { sent: 0, failed: [], skipped: 0 };
  if (!(await getAdminCaller())) {
    return { ok: false, ...empty, message: "Non autorizzato." };
  }
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, ...empty, message: "Database non configurato." };
  }
  if (!isEmailConfigured) {
    return { ok: false, ...empty, message: "Email non configurata (Resend)." };
  }
  const { bank } = await getSiteSettings();
  if (!isBankComplete(bank)) {
    return {
      ok: false,
      ...empty,
      message: "Inserisci IBAN e intestatario in Impostazioni prima di inviare.",
    };
  }

  let query = admin
    .from("orders")
    .select("id, reference, customer_email, total_cents, shipping")
    .eq("payment_method", "bank")
    .eq("payment_status", "unpaid")
    .eq("status", "pending");
  if (orderId) query = query.eq("id", orderId);
  const { data, error } = await query;
  if (error || !data) {
    return { ok: false, ...empty, message: "Lettura ordini non riuscita." };
  }

  let sent = 0;
  let skipped = 0;
  const failed: string[] = [];
  for (const row of data) {
    const reference = String(row.reference ?? "");
    const to = String(row.customer_email ?? "").trim();
    const shipping = (row.shipping as Record<string, unknown>) ?? {};
    const last = Date.parse(String(shipping.bankDetailsResentAt ?? ""));
    if (!to || (Number.isFinite(last) && Date.now() - last < RESEND_COOLDOWN_MS)) {
      skipped++;
      continue;
    }

    const { subject, html, text } = orderPreConfirmationEmail({
      reference,
      paymentMethod: "bank",
      totalCents: Number(row.total_cents ?? 0),
      bank,
      reminder: true,
    });
    // Resend accetta poche richieste al secondo: si va uno alla volta.
    if (sent + failed.length > 0) await wait(600);
    if (await sendEmail({ to, subject, html, text })) {
      sent++;
      await admin
        .from("orders")
        .update({
          shipping: { ...shipping, bankDetailsResentAt: new Date().toISOString() },
        })
        .eq("id", String(row.id));
    } else {
      failed.push(reference);
    }
  }

  refresh();
  return { ok: failed.length === 0, sent, failed, skipped };
}
