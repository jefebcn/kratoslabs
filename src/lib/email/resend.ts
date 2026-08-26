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

/**
 * Pulisce un indirizzo/mittente: rimuove spazi e punteggiatura finale (es. un
 * punto lasciato per errore in RESEND_FROM), che renderebbe il campo non valido.
 */
function cleanAddress(v: string): string {
  return v.trim().replace(/[\s.,;]+$/, "").trim();
}

const RESEND_API_KEY = (process.env.RESEND_API_KEY ?? "").trim();
const RESEND_FROM = cleanAddress(process.env.RESEND_FROM ?? "");
const RESEND_REPLY_TO = cleanAddress(process.env.RESEND_REPLY_TO ?? SITE.email);

export const isEmailConfigured = Boolean(RESEND_API_KEY && RESEND_FROM);

/** Mittente configurato (senza segreti): utile solo per la diagnostica admin. */
export const emailFrom = RESEND_FROM;

export interface SendResult {
  ok: boolean;
  /** Codice HTTP restituito da Resend, se disponibile. */
  status?: number;
  /** Messaggio d'errore leggibile (dal corpo della risposta Resend). */
  error?: string;
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  /** Versione testo semplice: migliora la recapitabilità (anti-spam). */
  text?: string;
  /** Sovrascrive il reply-to di default. */
  replyTo?: string;
}

/**
 * Invia l'email e restituisce l'esito dettagliato, incluso il messaggio
 * d'errore reale di Resend (es. dominio non verificato, from non valido).
 */
export async function sendEmailResult({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendArgs): Promise<SendResult> {
  if (!isEmailConfigured) {
    return {
      ok: false,
      error: "Email non configurata (RESEND_API_KEY / RESEND_FROM mancanti).",
    };
  }
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
    if (res.ok) return { ok: true, status: res.status };

    // Estrae il messaggio d'errore reale dal corpo della risposta.
    let message = "";
    try {
      const body = (await res.json()) as { message?: string; error?: string };
      message = body.message || body.error || "";
    } catch {
      try {
        message = await res.text();
      } catch {
        message = "";
      }
    }
    return { ok: false, status: res.status, error: message || `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore di rete" };
  }
}

/** Invio "fire and forget": true se accettato da Resend. */
export async function sendEmail(args: SendArgs): Promise<boolean> {
  return (await sendEmailResult(args)).ok;
}
