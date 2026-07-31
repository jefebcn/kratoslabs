import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { MOCK_ORDERS } from "@/lib/mock-data";
import type { CartLine, Order, OrderStatus } from "@/types";

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export interface AdminOrder extends Order {
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  shipping: Record<string, unknown>;
}

/** Ordini demo (mock) presentati come AdminOrder quando manca il service role. */
function mockAsAdmin(): AdminOrder[] {
  return MOCK_ORDERS.map((o) => ({
    ...o,
    paymentMethod: null,
    paymentStatus: o.status === "pending" ? "unpaid" : "paid",
    shipping: {},
  }));
}

function rowToAdminOrder(r: Record<string, unknown>): AdminOrder {
  return {
    id: String(r.id),
    reference: String(r.reference ?? ""),
    customerEmail: String(r.customer_email ?? ""),
    status: (r.status as OrderStatus) ?? "pending",
    totalCents: Number(r.total_cents ?? 0),
    lines: Array.isArray(r.lines) ? (r.lines as CartLine[]) : [],
    trackingId: (r.tracking_id as string) || undefined,
    createdAt: String(r.created_at ?? ""),
    paymentMethod: (r.payment_method as string) ?? null,
    paymentStatus: (r.payment_status as PaymentStatus) ?? "unpaid",
    shipping: (r.shipping as Record<string, unknown>) ?? {},
  };
}

/**
 * Elenca gli ordini. Con service role legge quelli reali da Supabase (anche
 * lista vuota = nessun ordine ancora). Senza service role mostra gli ordini
 * demo, così la dashboard resta illustrativa in locale.
 */
export async function listOrders(): Promise<AdminOrder[]> {
  const admin = createAdminClient();
  if (!admin) return mockAsAdmin();
  try {
    const { data, error } = await admin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !data) return mockAsAdmin();
    return data.map(rowToAdminOrder);
  } catch {
    return mockAsAdmin();
  }
}

/**
 * Ordini di un singolo cliente (per l'area riservata). Usa il service role e
 * filtra per user_id o email, così il cliente vede tutti i propri ordini anche
 * se effettuati prima del login. Ritorna lista vuota se non configurato.
 */
export async function listOrdersForUser(
  userId: string,
  email: string,
): Promise<AdminOrder[]> {
  const admin = createAdminClient();
  if (!admin) return [];
  const filters: string[] = [];
  if (userId) filters.push(`user_id.eq.${userId}`);
  if (email) filters.push(`customer_email.eq.${email}`);
  if (filters.length === 0) return [];
  try {
    const { data, error } = await admin
      .from("orders")
      .select("*")
      .or(filters.join(","))
      .order("created_at", { ascending: false })
      .limit(100);
    if (error || !data) return [];
    return data.map(rowToAdminOrder);
  } catch {
    return [];
  }
}

export interface OrderStats {
  revenueCents: number;
  ordersCount: number;
  avgOrderCents: number;
  unpaidCount: number;
  processing: number;
  shipped: number;
}

/** Sintesi per la dashboard (ricavi = solo ordini pagati). */
export function summarizeOrders(orders: AdminOrder[]): OrderStats {
  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const revenueCents = paid.reduce((s, o) => s + o.totalCents, 0);
  return {
    revenueCents,
    ordersCount: orders.length,
    avgOrderCents: paid.length ? Math.round(revenueCents / paid.length) : 0,
    unpaidCount: orders.filter((o) => o.paymentStatus === "unpaid").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
  };
}
