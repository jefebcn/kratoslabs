/**
 * Invio email transazionali via Resend (API REST, nessun pacchetto).
 * Guardato da RESEND_API_KEY + RESEND_FROM: se mancano, non invia e non lancia.
 *
 * Variabili d'ambiente (impostare su Vercel, MAI nel codice):
 *  - RESEND_API_KEY   chiave "re_..."
 *  - RESEND_FROM      mittente verificato, es. "KratosLabs <no-reply@kratoslabs.shop>"
 *  - RESEND_REPLY_TO  (opzionale) indirizzo a cui rispondono i clienti
 */
import { SITE } from "@/lib/constants";

const RESEND_API_KEY = (process.env.RESEND_API_KEY ?? "").trim();
const RESEND_FROM = (process.env.RESEND_FROM ?? "").trim();
const RESEND_REPLY_TO = (process.env.RESEND_REPLY_TO ?? SITE.email).trim();

export const isEmailConfigured = Boolean(RESEND_API_KEY && RESEND_FROM);

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  /** Versione testo semplice: migliora la recapitabilità (anti-spam). */
  text?: string;
  /** Sovrascrive il reply-to di default. */
  replyTo?: string;
}): Promise<boolean> {
  if (!isEmailConfigured) return false;
  try {
    const payload: Record<string, unknown> = {
      from: RESEND_FROM,
      to,
      subject,
      html,
    };
    if (text) payload.text = text;
    const rt = (replyTo ?? RESEND_REPLY_TO).trim();
    if (rt) payload.reply_to = rt;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
