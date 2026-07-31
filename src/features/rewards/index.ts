import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RewardEntry {
  id: string;
  delta: number;
  reason: string;
  orderRef: string | null;
  createdAt: string;
}

type Admin = SupabaseClient;

/** Somma i delta del ledger di un utente = saldo punti attuale. */
export async function balanceFor(admin: Admin, userId: string): Promise<number> {
  const { data, error } = await admin
    .from("reward_ledger")
    .select("delta")
    .eq("user_id", userId);
  if (error || !data) return 0;
  return data.reduce((s, r) => s + Number((r as { delta: number }).delta || 0), 0);
}

/** Aggiunge una riga al ledger (earn/redeem/refund/reverse). */
export async function addEntry(
  admin: Admin,
  userId: string,
  delta: number,
  reason: string,
  orderRef?: string | null,
): Promise<void> {
  if (!userId || !delta) return;
  await admin.from("reward_ledger").insert({
    user_id: userId,
    delta,
    reason,
    order_ref: orderRef ?? null,
  });
}

/** True se esiste già una riga per (ordine, motivo): evita doppi accrediti. */
export async function hasEntry(
  admin: Admin,
  orderRef: string,
  reason: string,
): Promise<boolean> {
  if (!orderRef) return false;
  const { data } = await admin
    .from("reward_ledger")
    .select("id")
    .eq("order_ref", orderRef)
    .eq("reason", reason)
    .limit(1);
  return Boolean(data && data.length > 0);
}

/** Saldo punti dell'utente (crea da sé il client service role). */
export async function getPointsBalance(userId: string): Promise<number> {
  const admin = createAdminClient();
  if (!admin || !userId) return 0;
  try {
    return await balanceFor(admin, userId);
  } catch {
    return 0;
  }
}

/** Storico movimenti punti dell'utente, dal più recente. */
export async function getPointsHistory(userId: string): Promise<RewardEntry[]> {
  const admin = createAdminClient();
  if (!admin || !userId) return [];
  try {
    const { data, error } = await admin
      .from("reward_ledger")
      .select("id,delta,reason,order_ref,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error || !data) return [];
    return data.map((r) => ({
      id: String(r.id),
      delta: Number(r.delta || 0),
      reason: String(r.reason || ""),
      orderRef: (r.order_ref as string) || null,
      createdAt: String(r.created_at || ""),
    }));
  } catch {
    return [];
  }
}
