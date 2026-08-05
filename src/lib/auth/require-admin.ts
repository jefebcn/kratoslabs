import "server-only";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/supabase/config";

/**
 * Ritorna l'utente corrente SOLO se è un admin autenticato, altrimenti null.
 * Da usare all'inizio di ogni Server Action sensibile (gestione utenti,
 * impostazioni, ordini): le Server Action sono endpoint POST pubblici, quindi
 * il controllo del layout non basta a proteggerle.
 */
export async function getAdminCaller(): Promise<User | null> {
  const user = await getCurrentUser();
  return isAdminUser(user) ? user : null;
}

/** Comodità booleana quando non serve l'oggetto utente. */
export async function isCallerAdmin(): Promise<boolean> {
  return (await getAdminCaller()) !== null;
}

/**
 * Blocca la Server Action se il chiamante non è un admin autenticato.
 * Difesa in profondità: il middleware protegge già le rotte /admin, ma le
 * Server Action sono endpoint POST e vanno verificate anche internamente.
 */
export async function assertAdmin(): Promise<void> {
  if (!(await isCallerAdmin())) throw new Error("Non autorizzato.");
}
