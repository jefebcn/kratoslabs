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

/**
 * Verifica che la chiave configurata sia davvero una chiave SEGRETA capace di
 * scrivere (bypassando la RLS), e non — per errore — una chiave PUBBLICA. È
 * l'errore di configurazione più comune su Vercel: con una publishable/anon key
 * le letture funzionano (RLS permette di leggere le righe attive) ma OGNI
 * scrittura viene silenziosamente bloccata dalle policy RLS.
 *
 * Ritorna un messaggio d'avviso (in italiano) se la chiave è palesemente
 * pubblica, altrimenti null. Non logga né espone mai la chiave.
 */
function inspectServiceKey(key: string): string | null {
  if (!key) return null;

  // Nuovo formato: le secret keys (sb_secret_…) sanno scrivere; le publishable
  // (sb_publishable_…) no.
  if (key.startsWith("sb_secret")) return null;
  if (key.startsWith("sb_publishable")) {
    return "La chiave configurata come SUPABASE_SERVICE_ROLE_KEY è una chiave PUBBLICA (sb_publishable_…): può solo leggere. Sostituiscila su Vercel con la Secret key (sb_secret_…) o la Service Role key, poi ridistribuisci.";
  }

  // Formato legacy JWT: il ruolo è nel payload. Solo "service_role" può scrivere.
  if (key.startsWith("eyJ")) {
    try {
      const part = key.split(".")[1] ?? "";
      const payload = JSON.parse(
        Buffer.from(part, "base64url").toString("utf8"),
      ) as { role?: string };
      if (payload.role === "service_role") return null;
      if (payload.role) {
        return `La chiave configurata come SUPABASE_SERVICE_ROLE_KEY ha ruolo "${payload.role}", non "service_role": è la chiave anon/pubblica e non può salvare. Usa la Service Role key (Supabase → Project Settings → API), poi ridistribuisci.`;
      }
    } catch {
      // Non decodificabile: non blocchiamo, lasciamo emergere l'eventuale
      // errore DB a runtime.
    }
  }

  return null;
}

/** true solo se URL valido + chiave segreta presenti. */
export const hasServiceRole = isSupabaseConfigured && SERVICE_KEY.length > 0;

/**
 * Avviso di configurazione (o null): valorizzato quando la chiave presente è
 * pubblica e quindi non potrà mai salvare. Da mostrare nell'admin.
 */
export const serviceKeyWarning = inspectServiceKey(SERVICE_KEY);

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
