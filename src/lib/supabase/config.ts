import type { User } from "@supabase/supabase-js";

/**
 * Configurazione Supabase letta dalle variabili d'ambiente.
 * NEXT_PUBLIC_* sono disponibili sia lato server sia lato client.
 */

/** Ripulisce i valori d'ambiente incollati con errori comuni. */
function clean(raw: string | undefined): string {
  return (raw ?? "").trim().replace(/^["']|["']$/g, "").trim();
}

/** Normalizza l'URL Supabase: aggiunge https:// se lo schema manca. */
function normalizeUrl(raw: string | undefined): string {
  const v = clean(raw);
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  // Nessuno schema ma sembra un host (es. xxxx.supabase.co): assume https.
  if (/^[a-z0-9.-]+\.[a-z]{2,}(:\d+)?(\/.*)?$/i.test(v)) return `https://${v}`;
  return v;
}

// Valori PUBBLICI del progetto (la publishable key è pensata da Supabase per
// stare nel browser ed è protetta dalle policy RLS). Le env su Vercel hanno la
// precedenza e permettono la rotazione; questi default garantiscono che l'auth
// funzioni anche se il nome della variabile su Vercel non combacia.
const FALLBACK_URL = "https://dpjrvwhpbmrwhodlzfei.supabase.co";
const FALLBACK_PUBLISHABLE = "sb_publishable_3YMIxj7IlIn8nmwcoeS31Q_kQvr2QSb";

export const SUPABASE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
);

// Supporta sia la nuova publishable key (sb_publishable_…) sia la vecchia anon.
export const SUPABASE_ANON_KEY = clean(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    FALLBACK_PUBLISHABLE,
);

/** L'URL è valido solo se è un http(s) ben formato: evita che un valore
 *  malformato faccia lanciare createServerClient (500 su tutto il sito). */
function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** true solo se URL valido e chiave presenti: altrimenti si va in pass-through. */
export const isSupabaseConfigured =
  isValidHttpUrl(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 0;

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
