import "server-only";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminUser } from "@/lib/supabase/config";

export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  role: string | null;
  isAdmin: boolean;
  banned: boolean;
  emailConfirmed: boolean;
}

/** true se l'utente ha un ban attivo (banned_until nel futuro). */
function isBanned(u: User): boolean {
  const until = (u as User & { banned_until?: string }).banned_until;
  if (!until || until === "none") return false;
  const t = Date.parse(until);
  return Number.isFinite(t) && t > Date.now();
}

/**
 * Elenca gli utenti registrati via Supabase Admin API. Richiede la chiave
 * segreta (service role): senza di essa ritorna lista vuota, così la pagina
 * degrada con grazia mostrando l'avviso di configurazione.
 */
export async function listUsers(): Promise<AdminUser[]> {
  const admin = createAdminClient();
  if (!admin) return [];
  try {
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (error || !data) return [];
    return data.users
      .map((u) => ({
        id: u.id,
        email: u.email ?? "—",
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
        role:
          ((u.app_metadata?.role as string | undefined) ??
            (u.user_metadata?.role as string | undefined)) ||
          null,
        isAdmin: isAdminUser(u),
        banned: isBanned(u),
        emailConfirmed: Boolean(u.email_confirmed_at),
      }))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  } catch {
    return [];
  }
}
