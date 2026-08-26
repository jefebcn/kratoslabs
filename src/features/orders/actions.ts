"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminCaller } from "@/lib/auth/require-admin";
import { isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { orderConfirmedEmail, orderShippedEmail } from "@/lib/email/templates";
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
