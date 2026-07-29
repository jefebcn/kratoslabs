"use server";

import { orderStatusSchema, productFormSchema } from "./schema";

export interface ActionResult {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

/**
 * Salvataggio prodotto (create/update). Oggi valida e restituisce esito;
 * lo strato di persistenza si aggancia qui senza toccare l'UI.
 */
export async function saveProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = productFormSchema.safeParse({
    ...raw,
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Alcuni campi non sono validi.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // TODO: upsert su DB.
  return { ok: true, message: `Prodotto "${parsed.data.title}" salvato.` };
}

/** Aggiornamento stato ordine + tracking. Stub validato. */
export async function updateOrderStatus(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = orderStatusSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: "Dati ordine non validi." };
  }

  // TODO: aggiornare lo stato su DB e notificare il cliente.
  return {
    ok: true,
    message: `Ordine ${parsed.data.orderId} aggiornato a "${parsed.data.status}".`,
  };
}
