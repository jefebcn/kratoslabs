"use server";

import { checkoutSchema } from "./schema";

export interface CheckoutResult {
  ok: boolean;
  reference?: string;
  paymentMethod?: string;
  errors?: Record<string, string[] | undefined>;
  message?: string;
}

/**
 * Server Action di esempio. Valida i dati e simula la creazione dell'ordine.
 * Da collegare a DB e provider di pagamento negli step successivi; la firma
 * (FormData -> risultato serializzabile) resta questa.
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

  // TODO: persistere l'ordine su Supabase (service role) una volta configurato.
  // La firma resta stabile; il client mostra le istruzioni di pagamento.
  const reference = `KL-${Date.now().toString().slice(-6)}`;
  return { ok: true, reference, paymentMethod: parsed.data.paymentMethod };
}
