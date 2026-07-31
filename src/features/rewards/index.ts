import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { POINTS_EXPIRY_DAYS } from "@/lib/rewards";

export interface RewardEntry {
  id: string;
  delta: number;
  reason: string;
  orderRef: string | null;
  createdAt: string;
}

type Admin = SupabaseClient;

/**
 * Somma i delta ancora validi del ledger di un utente = saldo punti attuale.
 * I punti guadagnati scaduti (expires_at passato) non contano; il saldo non
 * scende mai sotto zero.
 */
export async function balanceFor(admin: Admin, userId: string): Promise<number> {
  const nowIso = new Date().toISOString();
  const { data, error } = await admin
    .from("reward_ledger")
    .select("delta,expires_at")
    .eq("user_id", userId);
  if (error || !data) return 0;
  const total = data.reduce((s, r) => {
    const row = r as { delta: number; expires_at: string | null };
    if (row.expires_at && row.expires_at < nowIso) return s; // scaduto
    return s + Number(row.delta || 0);
  }, 0);
  return Math.max(0, total);
}

/**
 * Aggiunge una riga al ledger. I punti guadagnati (delta > 0) scadono dopo
 * POINTS_EXPIRY_DAYS giorni; le scritture negative/rimborsi non scadono, se non
 * indicato diversamente con `expires`.
 */
export async function addEntry(
  admin: Admin,
  userId: string,
  delta: number,
  reason: string,
  orderRef?: string | null,
  expires = delta > 0,
): Promise<void> {
  if (!userId || !delta) return;
  const expiresAt = expires
    ? new Date(Date.now() + POINTS_EXPIRY_DAYS * 86_400_000).toISOString()
    : null;
  await admin.from("reward_ledger").insert({
    user_id: userId,
    delta,
    reason,
    order_ref: orderRef ?? null,
    expires_at: expiresAt,
  });
}

/** True se l'utente ha già ricevuto un bonus con quel motivo. */
export async function hasUserReason(
  admin: Admin,
  userId: string,
  reason: string,
): Promise<boolean> {
  const { data } = await admin
    .from("reward_ledger")
    .select("id")
    .eq("user_id", userId)
    .eq("reason", reason)
    .limit(1);
  return Boolean(data && data.length > 0);
}

/** Accredita un bonus una tantum (idempotente per motivo). */
export async function grantOnceBonus(
  userId: string,
  reason: string,
  points: number,
): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin || !userId || points <= 0) return false;
  try {
    if (await hasUserReason(admin, userId, reason)) return false;
    await addEntry(admin, userId, points, reason, null, true);
    return true;
  } catch {
    return false;
  }
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
