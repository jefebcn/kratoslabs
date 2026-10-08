/**
 * Destinazione dopo il login (`?next=`), accettata solo se è un percorso
 * interno al sito: "/account" sì, "https://…" o "//altro-sito" no (eviterebbe
 * che un link costruito ad arte porti l'utente fuori dal sito dopo l'accesso).
 */
export function safeNext(raw: string | null | undefined, fallback = "/"): string {
  const v = (raw ?? "").trim();
  if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\")) {
    return fallback;
  }
  return v;
}
