/**
 * Righe per il foglio ordini del fornitore (tab "SALES 2026 EUR").
 *
 * Ogni riga copre le colonne da A a M, nell'ordine del foglio:
 *
 *   A Date · B (vuota) · C ORDER ID · D Recipient Name · E Address · F City
 *   G ZIP · H Country · I Phone nr. · J EMAIL · K SELL CLASS · L Item Name
 *   M Qty.
 *
 * Si ferma volutamente a M: da N a S (BUY/SELL PRICE, BUY/SELL SUM, Shipping,
 * TOTAL) il foglio calcola i valori con formule, e incollarci sopra dei valori
 * le cancellerebbe. La colonna B è nascosta e inutilizzata: resta una cella
 * vuota perché la riga va incollata a partire da A.
 *
 * Un ordine con più prodotti produce una riga per prodotto, con i dati del
 * destinatario ripetuti: nel foglio ogni riga ha un solo Item Name.
 */

import type { Product } from "@/types";
import type { AdminOrder } from "@/features/orders/queries";

/** Numero di colonne da A a M incluse. */
export const SUPPLIER_COLUMNS = 13;

/** Intestazioni, nello stesso ordine delle celle (per l'anteprima in admin). */
export const SUPPLIER_HEADERS = [
  "Date",
  "B",
  "Order ID",
  "Recipient",
  "Address",
  "City",
  "ZIP",
  "Country",
  "Phone",
  "Email",
  "Sell class",
  "Item Name",
  "Qty",
] as const;

/** Codice usato dal checkout per "Altro paese (extra-Europa)". */
const OTHER_COUNTRY = "ZZ";

export interface SupplierRows {
  rows: string[][];
  /** Problemi da controllare prima di incollare (mostrati in admin). */
  warnings: string[];
}

/** Una cella non deve contenere tab o a capo: romperebbero la riga incollata. */
function cell(v: unknown): string {
  return String(v ?? "")
    .replace(/[\t\r\n]+/g, " ")
    .trim();
}

/**
 * Data dell'ordine nel formato del foglio (M/D/YYYY, impostazione USA), nel
 * fuso di Roma: un ordine delle 00:30 italiane appartiene a quel giorno, non
 * al precedente in UTC.
 */
export function sheetDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(d);
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${get("month")}/${get("day")}/${get("year")}`;
}

/** Nome del paese in inglese a partire dal codice ISO salvato dal checkout. */
export function countryName(code: string): string {
  const c = code.trim().toUpperCase();
  if (!c || c === OTHER_COUNTRY) return "";
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(c);
    return name && name !== c ? name : c;
  } catch {
    return c;
  }
}

/**
 * Nome prodotto nel formato del fornitore: `TITOLO (Principio attivo)`, con il
 * principio attivo privato del dosaggio. Es. titolo "TESTOMED E 250" +
 * "Testosterone Enanthate 250mg/ml" → "TESTOMED E 250 (Testosterone Enanthate)".
 * Catalogo e foglio derivano dallo stesso listino Deus, quindi i nomi combaciano.
 */
export function supplierItemName(title: string, activeName?: string): string {
  const ingredient = (activeName ?? "")
    .replace(
      /\s*\d[\d.,]*\s*(mg|mcg|µg|iu|ui|g|ml)(\s*\/\s*(ml|tab|caps|cap|vial|fiala))?.*$/i,
      "",
    )
    .trim();
  return ingredient ? `${title.trim()} (${ingredient})` : title.trim();
}

/**
 * Righe da incollare nel foglio per un ordine. `catalog` serve a ricavare il
 * principio attivo di ogni prodotto; se un prodotto non è più in catalogo si
 * usa il titolo salvato nell'ordine e lo si segnala.
 */
export function supplierRows(
  order: AdminOrder,
  catalog: Product[],
): SupplierRows {
  const s = order.shipping;
  const warnings: string[] = [];

  const countryCode = cell(s.country);
  const country = countryName(countryCode);
  if (countryCode.toUpperCase() === OTHER_COUNTRY) {
    warnings.push(
      'Paese "Altro (extra-Europa)": il checkout non registra il paese esatto, inseriscilo a mano.',
    );
  }

  const phone = cell(s.phone);
  if (!phone) {
    warnings.push("Telefono assente (ordine precedente al campo obbligatorio).");
  }

  const byId = new Map(catalog.map((p) => [p.id, p] as const));
  const bySlug = new Map(catalog.map((p) => [p.slug, p] as const));

  const recipient = cell(`${cell(s.firstName)} ${cell(s.lastName)}`);
  const base = [
    sheetDate(order.createdAt),
    "",
    cell(order.reference),
    recipient,
    cell(s.address),
    cell(s.city),
    cell(s.postalCode),
    country,
    phone,
    cell(order.customerEmail),
    "DS",
  ];

  const rows = order.lines.map((line) => {
    const product = byId.get(line.productId) ?? bySlug.get(line.slug);
    if (!product) {
      warnings.push(
        `"${line.title}" non è più in catalogo: controlla il nome nel foglio.`,
      );
    }
    const item = product
      ? supplierItemName(product.title, product.specs.activeName)
      : cell(line.title);
    return [...base, cell(item), String(line.quantity)];
  });

  return { rows, warnings };
}

/*
 * Google Sheets interpreta ogni valore incollato come se fosse digitato:
 *  - un testo che inizia con = + - @ diventa una FORMULA. Nome, indirizzo,
 *    città ed email li scrive il cliente: senza protezione, un indirizzo come
 *    `=IMAGE("https://…"&A1)` diventerebbe una formula attiva nel foglio del
 *    fornitore, capace di inviare all'esterno i dati degli altri ordini
 *    (CSV/formula injection);
 *  - un valore numerico perde gli zeri iniziali: il CAP 00184 diventerebbe 184,
 *    e un telefono lungo finirebbe in notazione scientifica.
 * L'apostrofo iniziale dice a Sheets "questo è testo" e non viene mostrato.
 * Si applica solo al testo copiato: l'anteprima in admin resta pulita.
 */

/** Colonne sempre testuali (CAP, telefono): apostrofo su ogni valore. */
const ALWAYS_TEXT = new Set([6, 8]);
/** Colonne scritte dal cliente o dal catalogo: apostrofo solo se serve. */
const FREE_TEXT = new Set([3, 4, 5, 9, 11]);

function escapeForSheet(value: string, col: number): string {
  if (!value) return value;
  if (ALWAYS_TEXT.has(col)) return `'${value}`;
  if (FREE_TEXT.has(col) && /^[=+\-@0]/.test(value)) return `'${value}`;
  return value;
}

/**
 * Testo separato da tabulazioni: incollato nella colonna A del foglio riempie
 * una cella per valore. Data e quantità restano non protette di proposito,
 * così Sheets le riconosce come data e numero.
 */
export function toTsv(rows: string[][]): string {
  return rows
    .map((r) => r.map((v, i) => escapeForSheet(v, i)).join("\t"))
    .join("\n");
}
