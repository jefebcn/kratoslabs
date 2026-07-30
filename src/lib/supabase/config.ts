import type { User } from "@supabase/supabase-js";

/**
 * Configurazione Supabase letta dalle variabili d'ambiente.
 * NEXT_PUBLIC_* sono disponibili sia lato server sia lato client.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** true solo se entrambe le chiavi sono presenti: evita crash quando manca l'env. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Un utente è admin se:
 *  - ha il ruolo "admin" nei metadati Supabase (app_metadata/user_metadata.role), oppure
 *  - la sua email è nell'allowlist ADMIN_EMAILS (env solo-server, separata da virgole).
 * Usare SOLO lato server/middleware (ADMIN_EMAILS non è esposto al client).
 */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;

  const role =
    (user.app_metadata?.role as string | undefined) ??
    (user.user_metadata?.role as string | undefined);
  if (role === "admin") return true;

  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return user.email ? allow.includes(user.email.toLowerCase()) : false;
}
