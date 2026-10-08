import { SITE } from "@/lib/constants";
import { trackingUrl } from "@/lib/tracking";
import { countryName } from "@/lib/supplier-sheet";
import { formatPrice } from "@/lib/utils";
import { formatIban, isBankComplete, type BankConfig } from "@/lib/payments/bank";
import type { CartLine } from "@/types";

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
function wrap(
  bodyHtml: string,
  preheader: string,
  footnote = `Email transazionale relativa al tuo ordine su ${esc(SITE.name)}.`,
): string {
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(SITE.name)}</title>
</head>
<body style="margin:0;padding:0;background:#f2f3f5;">
<!-- Anteprima mostrata dai client accanto all'oggetto. Nascosta solo con
     display/dimensioni: niente colore trasparente né opacità, che i filtri
     antispam leggono come "testo invisibile" (SpamAssassin: HTML_FONT_LOW_CONTRAST). -->
<div style="display:none;max-height:0;max-width:0;overflow:hidden;mso-hide:all">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3f5;padding:24px 12px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid ${LINE};border-radius:10px;overflow:hidden">
      <!-- Header -->
      <tr>
        <td bgcolor="${INK}" style="background-color:${INK};padding:22px 24px;border-bottom:3px solid ${ACCENT}">
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
      ${footnote}
    </p>
  </td></tr>
</table>
</body>
</html>`;
}

/** Bottone CTA table-based (compatibile Outlook). */
function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0"><tr>
    <td bgcolor="${ACCENT}" style="border-radius:8px;background-color:${ACCENT}">
      <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;text-transform:uppercase;letter-spacing:.5px">${esc(label)}</a>
    </td>
  </tr></table>`;
}

/**
 * Invito ad aggiungere il mittente ai contatti: è il segnale che più aiuta le
 * email successive (conferma, tracking) ad arrivare in Posta in arrivo.
 */
const CONTACTS_HINT =
  "Per ricevere senza intoppi la conferma e il codice di tracciamento, aggiungi questo indirizzo ai tuoi contatti.";

const footerText = `\n\n—\n${SITE.name} — ${SITE.tagline}\nAssistenza: ${SITE.email} · Telegram: ${SITE.telegramUrl}`;

/* -------------------------------------------------------------------------- */
/*  1. Pre-conferma ordine                                                    */
/* -------------------------------------------------------------------------- */
export function orderPreConfirmationEmail({
  reference,
  paymentMethod,
  totalCents,
  bank,
  reminder = false,
}: {
  reference: string;
  paymentMethod?: string;
  /** true = reinvio dei dati di pagamento per un ordine già ricevuto. */
  reminder?: boolean;
  /** Importo da pagare (dopo sconto punti e con spedizione). */
  totalCents?: number;
  /** Coordinate bancarie: incluse se il metodo è bonifico e sono complete. */
  bank?: BankConfig;
}): EmailContent {
  const isBank = paymentMethod === "bank";
  const method = isBank ? "bonifico bancario" : "criptovaluta";
  const timing = isBank
    ? "Alla ricezione del bonifico (di norma entro 24–48 ore) confermeremo l'ordine con una seconda email."
    : "Appena verifichiamo il pagamento confermeremo l'ordine con una seconda email.";
  const amount =
    typeof totalCents === "number" && totalCents > 0 ? formatPrice(totalCents) : "";

  // Coordinate bancarie: stessi valori mostrati nella pagina dopo l'ordine.
  // Gli indirizzi crypto restano solo sul sito: un indirizzo Bitcoin nel testo
  // è un segnale tipico delle email di estorsione e fa salire il punteggio
  // spam (SpamAssassin: PDS_BTC_ID).
  const payRows: [string, string][] = [];
  if (isBank && bank && isBankComplete(bank)) {
    payRows.push(["Intestatario", bank.holder], ["IBAN", formatIban(bank.iban)]);
    if (bank.bic) payRows.push(["BIC / SWIFT", bank.bic]);
    if (bank.bank) payRows.push(["Banca", bank.bank]);
    payRows.push(["Causale", reference]);
  }
  const hasPayment = payRows.length > 0;
  const payIntro =
    "Esegui il bonifico con questi dati, indicando come causale il riferimento dell'ordine:";

  const subject = reminder
    ? `Dati per il pagamento dell'ordine ${reference}`
    : `Abbiamo ricevuto il tuo ordine ${reference}`;
  const intro = reminder
    ? "Ti rimandiamo i dati per completare il pagamento del tuo ordine."
    : "Grazie, abbiamo registrato il tuo ordine.";
  const summaryRows: [string, string][] = [
    ["Riferimento ordine", reference],
    ["Metodo di pagamento", method],
    ...(amount ? [["Importo da pagare", amount] as [string, string]] : []),
  ];
  const tableHtml = (rows: [string, string][], mono = false) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;border:1px solid ${LINE};border-radius:8px">${rows
      .map(([k, v], i) => {
        const border = i < rows.length - 1 ? `border-bottom:1px solid ${LINE};` : "";
        return `<tr><td style="padding:12px 14px;${border}font-size:14px;color:${MUTED};white-space:nowrap;vertical-align:top">${esc(k)}</td>
          <td style="padding:12px 14px;${border}font-size:14px;font-weight:700;text-align:right;word-break:break-all${mono ? ";font-family:Consolas,Menlo,monospace" : ""}">${esc(v)}</td></tr>`;
      })
      .join("")}</table>`;

  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">${intro}</p>
    ${tableHtml(summaryRows)}
    <p style="margin:0 0 14px">Questa è una <strong>pre-conferma</strong>: l'ordine non è ancora confermato. ${timing}</p>
    ${hasPayment ? `<p style="margin:0 0 8px;font-weight:700">${esc(payIntro)}</p>${tableHtml(payRows, true)}` : ""}
    <p style="margin:0 0 14px;color:${MUTED};font-size:13px">Indica il riferimento <strong>${esc(reference)}</strong> nel pagamento, così possiamo abbinarlo al tuo ordine.</p>
    <p style="margin:0;color:${MUTED};font-size:13px">${CONTACTS_HINT}</p>
    `,
    reminder
      ? `Ordine ${reference} — dati per il pagamento`
      : `Ordine ${reference} ricevuto — pre-conferma`,
  );
  const text = `${intro}

${summaryRows.map(([k, v]) => `${k}: ${v}`).join("\n")}

Questa è una pre-conferma: l'ordine non è ancora confermato. ${timing}
${hasPayment ? `\n${payIntro}\n${payRows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n` : ""}
Indica il riferimento ${reference} nel pagamento, così possiamo abbinarlo al tuo ordine.

${CONTACTS_HINT}${footerText}`;
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
    ${hasTracking ? button(trackingUrl(String(trackingId)), "Traccia spedizione") : button(`${SITE_URL}/account`, "Vedi i tuoi ordini")}
    <p style="margin:0;color:${MUTED};font-size:13px">Se il tracciamento non si aggiorna o hai domande, rispondi a questa email o scrivici su Telegram.</p>
    `,
    `Ordine ${reference} spedito${hasTracking ? ` — tracking ${trackingId}` : ""}`,
  );
  const text = `Il tuo ordine è in viaggio.

Riferimento ordine: ${reference}${hasTracking ? `\nCodice di tracciamento: ${trackingId}\nTraccia: ${trackingUrl(String(trackingId))}` : ""}

Consegna indicativa in 2–4 settimane. Imballo neutro e anonimo, con tracciamento.
I tuoi ordini: ${SITE_URL}/account

Se il tracciamento non si aggiorna o hai domande, rispondi a questa email o scrivici su Telegram.${footerText}`;
  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/*  Notifiche per l'admin                                                     */
/* -------------------------------------------------------------------------- */

const ADMIN_FOOTNOTE = `Notifica automatica per gli amministratori di ${esc(SITE.name)}.`;

/** Riga etichetta/valore per le tabelle riepilogo delle email admin. */
function adminRow(label: string, valueHtml: string, last = false): string {
  const border = last ? "" : `border-bottom:1px solid ${LINE};`;
  return `<tr><td style="padding:9px 12px;${border}font-size:13px;color:${MUTED};white-space:nowrap;vertical-align:top">${esc(label)}</td>
          <td style="padding:9px 12px;${border}font-size:14px;font-weight:700;text-align:right">${valueHtml}</td></tr>`;
}

function adminTable(rows: string[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;border:1px solid ${LINE};border-radius:8px">${rows.join("")}</table>`;
}

const ROME_TIME = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  dateStyle: "short",
  timeStyle: "short",
});

export interface AdminOrderInfo {
  reference: string;
  paymentMethod: string;
  totalCents: number;
  shippingCents: number;
  discountCents: number;
  pointsRedeemed: number;
  lines: CartLine[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    notes?: string;
  };
  /** true se la riga è stata salvata su Supabase (visibile in /admin/orders). */
  saved: boolean;
  /** true se al cliente è partita l'email di pre-conferma. */
  customerEmailSent: boolean;
}

/** Nuovo ordine: arriva agli admin subito dopo il checkout. */
export function adminNewOrderEmail(o: AdminOrderInfo): EmailContent {
  const c = o.customer;
  const method = o.paymentMethod === "bank" ? "Bonifico" : o.paymentMethod === "crypto" ? "Crypto" : o.paymentMethod;
  const name = `${c.firstName} ${c.lastName}`.trim();
  const country = countryName(c.country) || c.country;
  const where = `${c.address}, ${c.postalCode} ${c.city}, ${country}`;
  const total = formatPrice(o.totalCents);
  const when = ROME_TIME.format(new Date());

  const subject = `Nuovo ordine ${o.reference} — ${total} (${method})`;

  const lineRows = o.lines.map((l, i) =>
    adminRow(`${l.quantity} ×`, esc(l.title), i === o.lines.length - 1),
  );

  const warnings: string[] = [];
  if (!o.saved) {
    warnings.push(
      "L'ordine NON è stato salvato nel database: non lo troverai in /admin/orders. Tutti i dati sono in questa email.",
    );
  }
  if (!o.customerEmailSent) {
    warnings.push(
      "Al cliente NON è partita l'email di pre-conferma: contattalo tu per confermare la ricezione.",
    );
  }
  const warningHtml = warnings
    .map(
      (w) =>
        `<p style="margin:0 0 14px;padding:10px 12px;border:1px solid ${ACCENT};border-radius:8px;font-size:13px;font-weight:700;color:${ACCENT}">${esc(w)}</p>`,
    )
    .join("");

  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">Nuovo ordine <span style="color:${ACCENT}">${esc(o.reference)}</span></p>
    ${warningHtml}
    <p style="margin:0 0 14px;font-size:14px">Stato: <strong>in attesa di pagamento</strong>. Quando il pagamento arriva, segna l'ordine come pagato in admin: il cliente riceverà la conferma.</p>
    ${adminTable([
      adminRow("Totale", esc(total)),
      adminRow("Metodo", esc(method)),
      adminRow("Spedizione", esc(o.shippingCents ? formatPrice(o.shippingCents) : "gratuita")),
      ...(o.discountCents
        ? [adminRow("Sconto punti", esc(`−${formatPrice(o.discountCents)} (${o.pointsRedeemed} pt)`))]
        : []),
      adminRow("Data", esc(when), true),
    ])}
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Prodotti</p>
    ${adminTable(lineRows)}
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Cliente</p>
    ${adminTable([
      adminRow("Nome", esc(name)),
      adminRow("Email", `<a href="mailto:${esc(c.email)}" style="color:${ACCENT};text-decoration:none">${esc(c.email)}</a>`),
      adminRow("Telefono", esc(c.phone)),
      adminRow("Indirizzo", esc(where), !c.notes),
      ...(c.notes ? [adminRow("Note", esc(c.notes), true)] : []),
    ])}
    ${button(`${SITE_URL}/admin/orders`, "Apri gli ordini")}
    <p style="margin:0;color:${MUTED};font-size:13px">Rispondendo a questa email scrivi direttamente al cliente.</p>
    `,
    `${o.reference} · ${total} · ${method} · ${name}`,
    ADMIN_FOOTNOTE,
  );

  const text = `Nuovo ordine ${o.reference}
${warnings.length ? `\n${warnings.map((w) => `ATTENZIONE: ${w}`).join("\n")}\n` : ""}
Stato: in attesa di pagamento.
Totale: ${total}
Metodo: ${method}
Spedizione: ${o.shippingCents ? formatPrice(o.shippingCents) : "gratuita"}${o.discountCents ? `\nSconto punti: −${formatPrice(o.discountCents)} (${o.pointsRedeemed} pt)` : ""}
Data: ${when}

Prodotti:
${o.lines.map((l) => `- ${l.quantity} × ${l.title}`).join("\n")}

Cliente:
${name}
${c.email}
${c.phone}
${where}${c.notes ? `\nNote: ${c.notes}` : ""}

Ordini: ${SITE_URL}/admin/orders
Rispondendo a questa email scrivi direttamente al cliente.`;

  return { subject, html, text };
}

/** Nuovo iscritto: arriva agli admin quando qualcuno crea un account. */
export function adminNewSignupEmail({
  email,
  name,
  createdAt,
  confirmed,
}: {
  email: string;
  name?: string;
  createdAt: string;
  confirmed: boolean;
}): EmailContent {
  const when = ROME_TIME.format(new Date(createdAt));
  const status = confirmed ? "email già confermata" : "deve ancora confermare l'email";
  const subject = `Nuovo iscritto: ${email}`;
  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">Nuovo account registrato</p>
    ${adminTable([
      ...(name ? [adminRow("Nome", esc(name))] : []),
      adminRow("Email", `<a href="mailto:${esc(email)}" style="color:${ACCENT};text-decoration:none">${esc(email)}</a>`),
      adminRow("Data", esc(when)),
      adminRow("Stato", esc(status), true),
    ])}
    ${button(`${SITE_URL}/admin/users`, "Apri gli utenti")}
    `,
    `${name ? `${name} · ` : ""}${email} si è registrato`,
    ADMIN_FOOTNOTE,
  );
  const text = `Nuovo account registrato
${name ? `\nNome: ${name}` : ""}
Email: ${email}
Data: ${when}
Stato: ${status}

Utenti: ${SITE_URL}/admin/users`;
  return { subject, html, text };
}
