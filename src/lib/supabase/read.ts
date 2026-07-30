import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

/**
 * Client di sola lettura pubblica (publishable/anon key), senza sessione.
 * Usato dai Server Component per leggere catalogo/categorie dal DB.
 * Ritorna null se Supabase non è configurato, così i chiamanti usano i mock.
 */
export function createReadClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
