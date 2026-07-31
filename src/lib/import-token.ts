import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Token firmato per autorizzare l'upload immagini dal bookmarklet (che gira
 * nel browser dell'admin su un altro dominio, quindi senza i cookie di
 * sessione). Il segreto resta lato server; al client va solo il token firmato.
 */
const SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  "kratoslabs-dev-secret";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

/** Crea un token valido per `ttlMs` (default 3 ore). */
export function createImportToken(ttlMs = 3 * 60 * 60 * 1000): string {
  const exp = Date.now() + ttlMs;
  return `${exp}.${sign(String(exp))}`;
}

/** Verifica il token: firma valida e non scaduto. */
export function verifyImportToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = sign(expStr);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
