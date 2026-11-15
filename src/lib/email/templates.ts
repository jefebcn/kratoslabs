import { SITE } from "@/lib/constants";
import { trackingUrl } from "@/lib/tracking";
import { countryName } from "@/lib/supplier-sheet";
import { formatPrice } from "@/lib/utils";
import { formatIban, isBankComplete, type BankConfig } from "@/lib/payments/bank";
import type { CartLine } from "@/types";
import {
  emailStrings,
  type EmailStrings,
  type PreConfirmationVariant,
} from "@/lib/email/i18n";

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

/** Testo con `**evidenza**` → HTML escapato, evidenza in grassetto. */
function rich(s: string, color?: string): string {
  return esc(s).replace(
    /\*\*(.+?)\*\*/g,
    color ? `<span style="color:${color}">$1</span>` : "<strong>$1</strong>",
  );
}

/** Stesso testo per la versione solo testo: senza asterischi. */
function plain(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "$1");
}

/**
 * Involucro email professionale, table-based per compatibilità con tutti i
 * client (Outlook incluso), stili inline, barra rossa del brand, preheader
 * nascosto e footer con contatti.
 */
function wrap(
  bodyHtml: string,
  preheader: string,
  {
    footnote,
    strings = emailStrings("it"),
  }: { footnote?: string; strings?: EmailStrings } = {},
): string {
  const lang = strings.intl.slice(0, 2);
  return `<!doctype html>
<html lang="${lang}">
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
          <p style="margin:0 0 6px;font-size:12px;color:${MUTED}">${esc(SITE.name)} — ${esc(strings.tagline)}</p>
          <p style="margin:0;font-size:12px;color:${MUTED}">
            ${esc(strings.support)}: <a href="mailto:${SITE.email}" style="color:${ACCENT};text-decoration:none">${SITE.email}</a>
            &nbsp;·&nbsp; <a href="${SITE.telegramUrl}" style="color:${ACCENT};text-decoration:none">Telegram</a>
          </p>
        </td>
      </tr>
    </table>
    <p style="max-width:560px;margin:14px auto 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#9aa0a9;text-align:center">
      ${footnote ?? esc(strings.footnote(SITE.name))}
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

/** Firma della versione solo testo. */
function footerText(t: EmailStrings): string {
  return `\n\n—\n${SITE.name} — ${t.tagline}\n${t.support}: ${SITE.email} · Telegram: ${SITE.telegramUrl}`;
}

/** Tabella etichetta/valore delle email ai clienti. */
function infoTable(rows: [string, string][], mono = false): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;border:1px solid ${LINE};border-radius:8px">${rows
    .map(([k, v], i) => {
      const border = i < rows.length - 1 ? `border-bottom:1px solid ${LINE};` : "";
      return `<tr><td style="padding:12px 14px;${border}font-size:14px;color:${MUTED};white-space:nowrap;vertical-align:top">${esc(k)}</td>
          <td style="padding:12px 14px;${border}font-size:14px;font-weight:700;text-align:right;word-break:break-all${mono ? ";font-family:Consolas,Menlo,monospace" : ""}">${esc(v)}</td></tr>`;
    })
    .join("")}</table>`;
}

/* -------------------------------------------------------------------------- */
/*  1. Pre-conferma ordine (e reinvio / promemoria dei dati di pagamento)     */
/* -------------------------------------------------------------------------- */
export type { PreConfirmationVariant };

export function orderPreConfirmationEmail({
  reference,
  paymentMethod,
  totalCents,
  bank,
  variant = "new",
  locale,
}: {
  reference: string;
  paymentMethod?: string;
  /**
   * "new" = pre-conferma al checkout; "resend" = dati rimandati a mano
   * dall'admin; "reminder" / "final" = promemoria automatici di pagamento.
   */
  variant?: PreConfirmationVariant;
  /** Importo da pagare (dopo sconto punti e con spedizione). */
  totalCents?: number;
  /** Coordinate bancarie: incluse se il metodo è bonifico e sono complete. */
  bank?: BankConfig;
  /** Lingua del cliente (salvata sull'ordine); italiano se assente. */
  locale?: string | null;
}): EmailContent {
  const t = emailStrings(locale);
  const isBank = paymentMethod === "bank";
  const method = isBank ? t.methodBank : t.methodCrypto;
  const timing = isBank ? t.timingBank : t.timingCrypto;
  const amount =
    typeof totalCents === "number" && totalCents > 0
      ? formatPrice(totalCents, t.intl)
      : "";

  // Coordinate bancarie: stessi valori mostrati nella pagina dopo l'ordine.
  // Gli indirizzi crypto restano solo sul sito: un indirizzo Bitcoin nel testo
  // è un segnale tipico delle email di estorsione e fa salire il punteggio
  // spam (SpamAssassin: PDS_BTC_ID).
  const payRows: [string, string][] = [];
  if (isBank && bank && isBankComplete(bank)) {
    payRows.push([t.holder, bank.holder], ["IBAN", formatIban(bank.iban)]);
    if (bank.bic) payRows.push(["BIC / SWIFT", bank.bic]);
    if (bank.bank) payRows.push([t.bank, bank.bank]);
    payRows.push([t.causal, reference]);
  }
  const hasPayment = payRows.length > 0;

  const copy = t.variants[variant];
  const subject = copy.subject(reference);
  // Nei promemoria il cliente potrebbe aver già pagato: lo diciamo subito.
  const status =
    variant === "reminder" || variant === "final"
      ? t.alreadyPaid
      : `${t.preStatus} ${timing}`;
  const summaryRows: [string, string][] = [
    [t.reference, reference],
    [t.paymentMethod, method],
    ...(amount ? [[t.amountDue, amount] as [string, string]] : []),
  ];

  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">${esc(copy.intro)}</p>
    ${infoTable(summaryRows)}
    <p style="margin:0 0 14px">${rich(status)}</p>
    ${hasPayment ? `<p style="margin:0 0 8px;font-weight:700">${esc(t.payIntro)}</p>${infoTable(payRows, true)}` : ""}
    <p style="margin:0 0 14px;color:${MUTED};font-size:13px">${rich(t.referenceHint(reference))}</p>
    <p style="margin:0;color:${MUTED};font-size:13px">${esc(t.contactsHint)}</p>
    `,
    copy.preheader(reference),
    { strings: t },
  );
  const text = `${copy.intro}

${summaryRows.map(([k, v]) => `${k}: ${v}`).join("\n")}

${plain(status)}
${hasPayment ? `\n${t.payIntro}\n${payRows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n` : ""}
${plain(t.referenceHint(reference))}

${t.contactsHint}${footerText(t)}`;
  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/*  2. Ordine confermato (pagamento ricevuto)                                 */
/* -------------------------------------------------------------------------- */
export function orderConfirmedEmail({
  reference,
  locale,
}: {
  reference: string;
  locale?: string | null;
}): EmailContent {
  const t = emailStrings(locale);
  const c = t.confirmed;
  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">${rich(c.headline, ACCENT)}</p>
    ${infoTable([[t.reference, reference]])}
    <p style="margin:0;color:${MUTED};font-size:13px">${esc(c.trackingSoon)}</p>
    `,
    c.preheader(reference),
    { strings: t },
  );
  const text = `${c.textLine(reference)}

${c.trackingSoon}${footerText(t)}`;
  return { subject: c.subject(reference), html, text };
}

/* -------------------------------------------------------------------------- */
/*  3. Ordine spedito (con tracking)                                          */
/* -------------------------------------------------------------------------- */
export function orderShippedEmail({
  reference,
  trackingId,
  locale,
}: {
  reference: string;
  trackingId?: string | null;
  locale?: string | null;
}): EmailContent {
  const t = emailStrings(locale);
  const s = t.shipped;
  const tracking = trackingId?.trim() ? trackingId.trim() : null;
  const rows: [string, string][] = [[t.reference, reference]];
  if (tracking) rows.push([s.trackingCode, tracking]);
  const html = wrap(
    `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700">${rich(s.headline, ACCENT)}</p>
    ${infoTable(rows)}
    <p style="margin:0 0 4px">${rich(s.delivery)}</p>
    ${tracking ? button(trackingUrl(tracking), s.trackButton) : button(`${SITE_URL}/account`, s.ordersButton)}
    <p style="margin:0;color:${MUTED};font-size:13px">${esc(s.help)}</p>
    `,
    `${s.preheader(reference)}${tracking ? ` — tracking ${tracking}` : ""}`,
    { strings: t },
  );
  const text = `${s.textHeadline}

${t.reference}: ${reference}${tracking ? `\n${s.trackingCode}: ${tracking}\n${s.track}: ${trackingUrl(tracking)}` : ""}

${plain(s.delivery)}
${s.yourOrders}: ${SITE_URL}/account

${s.help}${footerText(t)}`;
  return { subject: s.subject(reference), html, text };
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
    { footnote: ADMIN_FOOTNOTE },
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
    { footnote: ADMIN_FOOTNOTE },
  );
  const text = `Nuovo account registrato
${name ? `\nNome: ${name}` : ""}
Email: ${email}
Data: ${when}
Stato: ${status}

Utenti: ${SITE_URL}/admin/users`;
  return { subject, html, text };
}
