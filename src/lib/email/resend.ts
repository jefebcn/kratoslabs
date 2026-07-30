/**
 * Invio email transazionali via Resend (API REST, nessun pacchetto).
 * Guardato da RESEND_API_KEY + RESEND_FROM: se mancano, non invia e non lancia.
 */
const RESEND_API_KEY = (process.env.RESEND_API_KEY ?? "").trim();
const RESEND_FROM = (process.env.RESEND_FROM ?? "").trim();

export const isEmailConfigured = Boolean(RESEND_API_KEY && RESEND_FROM);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!isEmailConfigured) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
