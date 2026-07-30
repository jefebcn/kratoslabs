"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminCaller } from "@/lib/auth/require-admin";
import { isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { orderConfirmedEmail } from "@/lib/email/templates";

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
  await admin.from("orders").update(patch).eq("id", parsed.data.orderId);
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
    .select("reference, customer_email, status")
    .maybeSingle();

  if (!error && data && isEmailConfigured) {
    const { subject, html } = orderConfirmedEmail({
      reference: String(data.reference),
    });
    await sendEmail({ to: String(data.customer_email), subject, html });
  }
  refresh();
}
