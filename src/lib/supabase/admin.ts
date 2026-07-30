import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Chiave SEGRETA (service role / secret key). SOLO lato server: bypassa la RLS
 * e permette all'admin di scrivere su Supabase. NON deve mai finire nel client
 * né nel repo — va impostata nelle Environment Variables di Vercel.
 * Supporta il vecchio nome (SERVICE_ROLE_KEY) e il nuovo (SECRET_KEY / sb_secret).
 */
const SERVICE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  ""
).trim();

/** true solo se URL valido + chiave segreta presenti. */
export const hasServiceRole = isSupabaseConfigured && SERVICE_KEY.length > 0;

/**
 * Client admin con service role. Ritorna null se la chiave non è configurata,
 * così i chiamanti possono degradare con grazia senza rompere il sito.
 */
export function createAdminClient() {
  if (!hasServiceRole) return null;
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
