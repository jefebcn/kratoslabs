"use server";

import { checkoutSchema } from "./schema";
import { isEmailConfigured, sendEmail } from "@/lib/email/resend";
import { orderPreConfirmationEmail } from "@/lib/email/templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";
import { balanceFor } from "@/features/rewards";
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
 * Riferimento ordine univoco e non indovinabile.
 *
 * La versione precedente (`KL-` + ultime 6 cifre di Date.now()) si ripeteva
 * ogni 10^6 ms ≈ 16 minuti e 40 secondi: su una colonna `unique` la collisione
 * faceva fallire l'inserimento, ed essendo di soli 10^6 valori la reference era
 * anche enumerabile. Qui usiamo 10 caratteri esadecimali casuali (~1,1e12
 * combinazioni), generati con il CSPRNG della piattaforma.
 */
function newOrderReference(): string {
  const hex = globalThis.crypto.randomUUID().replace(/-/g, "");
  return `KL-${hex.slice(0, 10).toUpperCase()}`;
}

/**
 * Traduce l'errore sollevato da `create_order` in un messaggio per il cliente.
 * Gli identificatori (`insufficient_stock:<slug>`, `insufficient_points`) sono
 * definiti in supabase/migrations/0019_create_order_tx.sql.
 */
function orderErrorMessage(raw: string, lines: CartLine[]): string {
  const stock = /insufficient_stock:(\S+)/.exec(raw);
  if (stock) {
    const slug = stock[1];
    const title = lines.find((l) => l.slug === slug)?.title ?? slug;
    return `Scorte insufficienti per "${title}". Riduci la quantità o rimuovilo dal carrello.`;
  }
  if (raw.includes("insufficient_points")) {
    return "Il tuo saldo punti è cambiato nel frattempo. Ricarica la pagina e riprova.";
  }
  return "Non è stato possibile registrare l'ordine. Riprova tra poco; se il problema persiste scrivici.";
}

/**
 * Server Action del checkout. Valida i dati, ricalcola i totali dai prezzi reali
 * del catalogo e persiste l'ordine su Supabase tramite la funzione transazionale
 * `create_order` (stock + ordine + punti in un'unica transazione).
 *
 * Se la persistenza fallisce l'ordine NON viene confermato: restituire `ok: true`
 * senza una riga a database significherebbe mandare al cliente un riferimento —
 * e un invito a pagare — per un ordine che non esiste.
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
  const reference = newOrderReference();

  // Spedizione: tariffa unica, gratuita oltre la soglia. Calcolata sul
  // subtotale merce (mai dal client).
  const shippingCents = shippingCentsFor(subtotalCents);

  // Sconto punti: validato lato server (mai fidarsi del client).
  let pointsRedeemed = 0;
  let discountCents = 0;
  let totalCents = subtotalCents + shippingCents;

  const admin = createAdminClient();

  if (!admin) {
    // Senza service role non possiamo scrivere l'ordine. In produzione è una
    // misconfigurazione: fermarsi è l'unico comportamento onesto, perché
    // confermare un ordine che non viene salvato porta il cliente a pagare per
    // nulla. In sviluppo si prosegue, così il flusso resta provabile a vuoto.
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        message:
          "Il servizio ordini non è disponibile in questo momento. Riprova più tardi o scrivici.",
      };
    }
  } else {
    const user = await getCurrentUser();

    // Sconto punti: proposto qui sui dati correnti, ma il saldo viene
    // riverificato dentro la transazione (vedi create_order), così due checkout
    // in parallelo non possono spendere lo stesso credito.
    if (user && requestedPoints > 0) {
      const balance = await balanceFor(admin, user.id);
      pointsRedeemed = maxRedeemablePoints(
        Math.min(balance, requestedPoints),
        subtotalCents,
      );
      discountCents = discountCentsFor(pointsRedeemed);
      totalCents = Math.max(0, subtotalCents - discountCents) + shippingCents;
    }

    // Stock, ordine e ledger punti in un'unica transazione: se un passo
    // fallisce non resta nulla a metà.
    const { error } = await admin.rpc("create_order", {
      p_reference: reference,
      p_user_id: user?.id ?? null,
      p_customer_email: d.email,
      p_lines: lines,
      p_shipping: {
        firstName: d.firstName,
        lastName: d.lastName,
        address: d.address,
        city: d.city,
        postalCode: d.postalCode,
        country: d.country,
        costCents: shippingCents,
        notes: d.notes ?? "",
      },
      p_payment_method: d.paymentMethod,
      p_total_cents: totalCents,
      p_discount_cents: discountCents,
      p_points_redeemed: pointsRedeemed,
    });

    if (error) {
      // Nessuna email, nessun riferimento: l'ordine non esiste.
      return { ok: false, message: orderErrorMessage(error.message, lines) };
    }
  }

  // Pre-conferma via email (no-op se Resend non è configurato).
  let emailSent = false;
  if (isEmailConfigured) {
    const { subject, html, text } = orderPreConfirmationEmail({
      reference,
      paymentMethod: d.paymentMethod,
    });
    emailSent = await sendEmail({ to: d.email, subject, html, text });
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
