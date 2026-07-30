"use server";

import { checkoutSchema } from "./schema";
import { isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { orderPreConfirmationEmail } from "@/lib/email/templates";

export interface CheckoutResult {
  ok: boolean;
  reference?: string;
  paymentMethod?: string;
  /** true se l'email di pre-conferma è stata effettivamente inviata. */
  emailSent?: boolean;
  errors?: Record<string, string[] | undefined>;
  message?: string;
}

/**
 * Server Action del checkout. Valida i dati, crea il riferimento e invia la
 * pre-conferma via email (se Resend è configurato). La persistenza su Supabase
 * (service role) e la conferma finale dopo verifica pagamento sono lo step
 * successivo; la firma (FormData -> risultato serializzabile) resta stabile.
 */
export async function createOrder(
  _prev: CheckoutResult | null,
  formData: FormData,
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Controlla i campi evidenziati.",
    };
  }

  const reference = `KL-${Date.now().toString().slice(-6)}`;

  // Pre-conferma via email (no-op se Resend non è configurato).
  let emailSent = false;
  if (isEmailConfigured) {
    const { subject, html } = orderPreConfirmationEmail({
      reference,
      paymentMethod: parsed.data.paymentMethod,
    });
    emailSent = await sendEmail({ to: parsed.data.email, subject, html });
  }

  return {
    ok: true,
    reference,
    paymentMethod: parsed.data.paymentMethod,
    emailSent,
  };
}
