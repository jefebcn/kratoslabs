"use server";

import { checkoutSchema } from "./schema";
import { isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { orderPreConfirmationEmail } from "@/lib/email/templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";
import { balanceFor, addEntry } from "@/features/rewards";
import { maxRedeemablePoints, discountCentsFor } from "@/lib/rewards";
import { listProducts } from "@/features/products";
import { priceLine } from "@/features/products/pricing";
import { PAYMENT_METHODS } from "@/lib/constants";
import {
  shippingCentsFor,
  meetsMinimumOrder,
  MIN_ORDER_CENTS,
} from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import type { CartLine } from "@/types";

const DISABLED_METHODS = new Set(
  PAYMENT_METHODS.filter((m) => m.disabled).map((m) => m.id),
);

export interface CheckoutResult {
  ok: boolean;
  reference?: string;
  paymentMethod?: string;
  /** Totale effettivo dell'ordine (dopo lo sconto punti), in centesimi. */
  totalCents?: number;
  /** Punti effettivamente usati su questo ordine. */
  pointsRedeemed?: number;
  /** true se l'email di pre-conferma è stata effettivamente inviata. */
  emailSent?: boolean;
  errors?: Record<string, string[] | undefined>;
  message?: string;
}

/** Ricostruisce e valida le righe carrello inviate dal client (hidden field). */
function parseLines(raw: string): CartLine[] {
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((l) => l && typeof l === "object")
      .map((l) => ({
        productId: String(l.productId ?? ""),
        slug: String(l.slug ?? ""),
        title: String(l.title ?? ""),
        brand: String(l.brand ?? ""),
        imageUrl: String(l.imageUrl ?? ""),
        unitPriceCents: Number(l.unitPriceCents ?? 0),
        quantity: Number(l.quantity ?? 0),
      }))
      .filter((l) => l.productId && l.quantity > 0);
  } catch {
    return [];
  }
}

/**
 * Server Action del checkout. Valida i dati, persiste l'ordine su Supabase
 * (service role, così il server controlla totali e stato) e invia la
 * pre-conferma via email. Se la persistenza o l'email non sono configurate, il
 * flusso resta funzionante: il cliente riceve comunque il riferimento.
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

  const d = parsed.data;

  if (DISABLED_METHODS.has(d.paymentMethod)) {
    return { ok: false, message: "Metodo di pagamento non disponibile." };
  }

  // Ricostruisce l'ordine dai PREZZI REALI del database (mai fidarsi dei valori
  // inviati dal client): dal carrello si usano solo prodotto e quantità.
  const requested = parseLines(String(formData.get("lines") ?? "[]"));
  const catalog = await listProducts();
  const byId = new Map(catalog.map((p) => [p.id, p] as const));
  const bySlug = new Map(catalog.map((p) => [p.slug, p] as const));

  const lines: CartLine[] = [];
  let subtotalCents = 0;
  for (const r of requested) {
    const product = byId.get(r.productId) ?? bySlug.get(r.slug);
    if (!product) continue; // prodotto inesistente o non più attivo
    const qty = Math.max(1, Math.min(999, Math.floor(r.quantity) || 0));
    subtotalCents += priceLine(product.priceCents, qty).netCents;
    lines.push({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      imageUrl: product.images[0]?.url ?? "",
      unitPriceCents: product.priceCents,
      quantity: qty,
    });
  }
  if (lines.length === 0) {
    return {
      ok: false,
      message:
        "Il carrello non è valido o i prodotti non sono più disponibili.",
    };
  }

  // Ordine minimo (merce): validato lato server (mai fidarsi del client).
  if (!meetsMinimumOrder(subtotalCents)) {
    return {
      ok: false,
      message: `L'ordine minimo è ${formatPrice(MIN_ORDER_CENTS)}. Aggiungi altri prodotti per procedere.`,
    };
  }

  const requestedPoints = Math.max(
    0,
    Math.floor(Number(formData.get("redeemPoints") ?? 0)) || 0,
  );
  const reference = `KL-${Date.now().toString().slice(-6)}`;

  // Spedizione: tariffa unica, gratuita oltre la soglia. Calcolata sul
  // subtotale merce (mai dal client).
  const shippingCents = shippingCentsFor(subtotalCents);

  // Sconto punti: validato lato server (mai fidarsi del client).
  let pointsRedeemed = 0;
  let discountCents = 0;
  let totalCents = subtotalCents + shippingCents;

  // Persistenza su Supabase (best-effort: non blocca il checkout se assente).
  const admin = createAdminClient();
  if (admin) {
    try {
      const user = await getCurrentUser();

      if (user && requestedPoints > 0) {
        const balance = await balanceFor(admin, user.id);
        pointsRedeemed = maxRedeemablePoints(
          Math.min(balance, requestedPoints),
          subtotalCents,
        );
        discountCents = discountCentsFor(pointsRedeemed);
        totalCents = Math.max(0, subtotalCents - discountCents) + shippingCents;
      }

      await admin.from("orders").insert({
        reference,
        user_id: user?.id ?? null,
        customer_email: d.email,
        status: "pending",
        total_cents: totalCents,
        discount_cents: discountCents,
        points_redeemed: pointsRedeemed,
        lines,
        shipping: {
          firstName: d.firstName,
          lastName: d.lastName,
          address: d.address,
          city: d.city,
          postalCode: d.postalCode,
          country: d.country,
          costCents: shippingCents,
          notes: d.notes ?? "",
        },
        payment_method: d.paymentMethod,
        payment_status: "unpaid",
      });

      // Scala i punti usati (il guadagno arriva alla conferma del pagamento).
      if (user && pointsRedeemed > 0) {
        await addEntry(admin, user.id, -pointsRedeemed, "redeem", reference);
      }
    } catch {
      // Persistenza non riuscita: si prosegue comunque con la pre-conferma.
      pointsRedeemed = 0;
      discountCents = 0;
      totalCents = subtotalCents + shippingCents;
    }
  }

  // Pre-conferma via email (no-op se Resend non è configurato).
  let emailSent = false;
  if (isEmailConfigured) {
    const { subject, html } = orderPreConfirmationEmail({
      reference,
      paymentMethod: d.paymentMethod,
    });
    emailSent = await sendEmail({ to: d.email, subject, html });
  }

  return {
    ok: true,
    reference,
    paymentMethod: d.paymentMethod,
    totalCents,
    pointsRedeemed,
    emailSent,
  };
}
