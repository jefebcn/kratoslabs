import { SITE } from "@/lib/constants";

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const ACCENT = "#e11d2a";
const INK = "#15181d";
const MUTED = "#5f6670";
const LINE = "#e4e7ec";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kratoslabs.shop";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Involucro email professionale, table-based per compatibilità con tutti i
 * client (Outlook incluso), stili inline, barra rossa del brand, preheader
 * nascosto e footer con contatti.
 */
function wrap(bodyHtml: string, preheader: string): string {
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(SITE.name)}</title>
</head>
<body style="margin:0;padding:0;background:#f2f3f5;">
<span style="display:none!important;opacity:0;color:transparent;visibility:hidden;height:0;width:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3f5;padding:24px 12px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid ${LINE};border-radius:10px;overflow:hidden">
      <!-- Header -->
      <tr>
        <td style="background:${INK};padding:22px 24px;border-bottom:3px solid ${ACCENT}">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;letter-spacing:1px;color:#ffffff;text-transform:uppercase">KRATOS<span style="color:${ACCENT}">LABS</span></span>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding:26px 24px;font-family:Arial,Helvetica,sans-serif;color:${INK};font-size:15px;line-height:1.6">
          ${bodyHtml}
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="padding:18px 24px;border-top:1px solid ${LINE};font-family:Arial,Helvetica,sans-serif">
          <p style="margin:0 0 6px;font-size:12px;color:${MUTED}">${esc(SITE.name)} — ${esc(SITE.tagline)}</p>
          <p style="margin:0;font-size:12px;color:${MUTED}">
            Assistenza: <a href="mailto:${SITE.email}" style="color:${ACCENT};text-decoration:none">${SITE.email}</a>
            &nbsp;·&nbsp; <a href="${SITE.telegramUrl}" style="color:${ACCENT};text-decoration:none">Telegram</a>
          </p>
        </td>
      </tr>
    </table>
    <p style="max-width:560px;margin:14px auto 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#9aa0a9;text-align:center">
      Email transazionale relativa al tuo ordine su ${esc(SITE.name)}.
    </p>
  </td></tr>
</table>
</body>
</html>`;
}

/** Bottone CTA table-based (compatibile Outlook). */
function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0"><tr>
    <td style="border-radius:8px;background:${ACCENT}">
      <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;text-transform:uppercase;letter-spacing:.5px">${esc(label)}</a>
    </td>
  </tr></table>`;
}

const footerText = `\n\n—\n${SITE.name} — ${SITE.tagline}\nAssistenza: ${SITE.email} · Telegram: ${SITE.telegramUrl}`;

/* -------------------------------------------------------------------------- */
/*  1. Pre-conferma ordine                                                    */
/* -------------------------------------------------------------------------- */
export function orderPreConfirmationEmail({
  reference,
  paymentMethod,
}: {
  reference: string;
  paymentMethod?: string;
}): EmailContent {
  const isBank = paymentMethod === "bank";
  const method = isBank ? "bonifico bancario" : "criptovaluta";
  const timing = isBank
    ? "Alla ricezione del bonifico (di norma entro 24–48 ore) confermeremo l'ordine con una seconda email."
    : "Appena verifichiamo il pagamento confermeremo l'ordine con una seconda email.";

  const subject = `Abbiamo ricevuto il tuo ordine ${reference}`;
  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">Grazie, abbiamo registrato il tuo ordine.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;border:1px solid ${LINE};border-radius:8px">
      <tr><td style="padding:12px 14px;border-bottom:1px solid ${LINE};font-size:14px;color:${MUTED}">Riferimento ordine</td>
          <td style="padding:12px 14px;border-bottom:1px solid ${LINE};font-size:14px;font-weight:700;text-align:right">${esc(reference)}</td></tr>
      <tr><td style="padding:12px 14px;font-size:14px;color:${MUTED}">Metodo di pagamento</td>
          <td style="padding:12px 14px;font-size:14px;font-weight:700;text-align:right">${esc(method)}</td></tr>
    </table>
    <p style="margin:0 0 14px">Questa è una <strong>pre-conferma</strong>: l'ordine non è ancora confermato. ${timing}</p>
    <p style="margin:0;color:${MUTED};font-size:13px">Indica il riferimento <strong>${esc(reference)}</strong> nel pagamento, così possiamo abbinarlo al tuo ordine.</p>
    `,
    `Ordine ${reference} ricevuto — pre-conferma`,
  );
  const text = `Grazie, abbiamo registrato il tuo ordine.

Riferimento ordine: ${reference}
Metodo di pagamento: ${method}

Questa è una pre-conferma: l'ordine non è ancora confermato. ${timing}

Indica il riferimento ${reference} nel pagamento, così possiamo abbinarlo al tuo ordine.${footerText}`;
  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/*  2. Ordine confermato (pagamento ricevuto)                                 */
/* -------------------------------------------------------------------------- */
export function orderConfirmedEmail({
  reference,
}: {
  reference: string;
}): EmailContent {
  const subject = `Ordine ${reference} confermato`;
  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">Pagamento ricevuto — ordine <span style="color:${ACCENT}">confermato</span>.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;border:1px solid ${LINE};border-radius:8px">
      <tr><td style="padding:12px 14px;font-size:14px;color:${MUTED}">Riferimento ordine</td>
          <td style="padding:12px 14px;font-size:14px;font-weight:700;text-align:right">${esc(reference)}</td></tr>
    </table>
    <p style="margin:0;color:${MUTED};font-size:13px">Ti avviseremo con il codice di tracciamento appena la spedizione sarà in viaggio.</p>
    `,
    `Ordine ${reference} confermato`,
  );
  const text = `Pagamento ricevuto: il tuo ordine ${reference} è confermato.

Ti avviseremo con il codice di tracciamento appena la spedizione sarà in viaggio.${footerText}`;
  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/*  3. Ordine spedito (con tracking)                                          */
/* -------------------------------------------------------------------------- */
export function orderShippedEmail({
  reference,
  trackingId,
}: {
  reference: string;
  trackingId?: string | null;
}): EmailContent {
  const hasTracking = Boolean(trackingId && trackingId.trim());
  const subject = `Ordine ${reference} spedito`;
  const trackRow = hasTracking
    ? `<tr><td style="padding:12px 14px;font-size:14px;color:${MUTED}">Codice di tracciamento</td>
          <td style="padding:12px 14px;font-size:14px;font-weight:700;text-align:right">${esc(String(trackingId))}</td></tr>`
    : "";
  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">Il tuo ordine è <span style="color:${ACCENT}">in viaggio</span>. 🐺</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;border:1px solid ${LINE};border-radius:8px">
      <tr><td style="padding:12px 14px;${hasTracking ? `border-bottom:1px solid ${LINE};` : ""}font-size:14px;color:${MUTED}">Riferimento ordine</td>
          <td style="padding:12px 14px;${hasTracking ? `border-bottom:1px solid ${LINE};` : ""}font-size:14px;font-weight:700;text-align:right">${esc(reference)}</td></tr>
      ${trackRow}
    </table>
    <p style="margin:0 0 4px">Consegna indicativa in <strong>2–4 settimane</strong>. Imballo neutro e anonimo, con tracciamento.</p>
    ${button(`${SITE_URL}/account`, "Vedi i tuoi ordini")}
    <p style="margin:0;color:${MUTED};font-size:13px">Se il tracciamento non si aggiorna o hai domande, rispondi a questa email o scrivici su Telegram.</p>
    `,
    `Ordine ${reference} spedito${hasTracking ? ` — tracking ${trackingId}` : ""}`,
  );
  const text = `Il tuo ordine è in viaggio.

Riferimento ordine: ${reference}${hasTracking ? `\nCodice di tracciamento: ${trackingId}` : ""}

Consegna indicativa in 2–4 settimane. Imballo neutro e anonimo, con tracciamento.
I tuoi ordini: ${SITE_URL}/account

Se il tracciamento non si aggiorna o hai domande, rispondi a questa email o scrivici su Telegram.${footerText}`;
  return { subject, html, text };
}
