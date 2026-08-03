/**
 * Regole del programma punti (Reward Points). Valori puri, usabili sia lato
 * client sia lato server.
 *
 *  - Guadagno: 5 punti ogni 25€ spesi (≈ 1 punto ogni 5€).
 *  - Valore: 100 punti = 25€ di sconto (1 punto = 0,25€).
 */
export const POINT_VALUE_CENTS = 10; // 1 punto = 0,10 €
export const EARN_DIVISOR_CENTS = 500; // 1 punto ogni 5€ → 5 punti / 25€

/** Quota massima dell'ordine copribile con i punti (esclusa spedizione). */
export const REDEEM_MAX_FRACTION = 0.7; // max 70%

/** Validità dei punti guadagnati, in giorni. */
export const POINTS_EXPIRY_DAYS = 90;

/** Bonus una tantum. */
export const BONUS_ACCOUNT = 5;
export const BONUS_NEWSLETTER = 5;
export const BONUS_FIRST_ORDER = 10;

/** Punti guadagnati per un ordine di `cents` (arrotondati per difetto). */
export function pointsEarnedFor(cents: number): number {
  if (!Number.isFinite(cents) || cents <= 0) return 0;
  return Math.floor(cents / EARN_DIVISOR_CENTS);
}

/** "Prezzo in punti": punti necessari per pagare interamente il prodotto. */
export function priceInPoints(cents: number): number {
  if (!Number.isFinite(cents) || cents <= 0) return 0;
  return Math.ceil(cents / POINT_VALUE_CENTS);
}

/** Sconto in centesimi ottenibile con `points` punti. */
export function discountCentsFor(points: number): number {
  if (!Number.isFinite(points) || points <= 0) return 0;
  return Math.floor(points) * POINT_VALUE_CENTS;
}

/** Valore in centesimi di un saldo punti. */
export function pointsValueCents(points: number): number {
  return discountCentsFor(points);
}

/**
 * Punti massimi spendibili: non oltre il saldo e non oltre il 70% del subtotale
 * (spedizione esclusa), così lo sconto copre al massimo il 70% dell'ordine.
 */
export function maxRedeemablePoints(
  balance: number,
  subtotalCents: number,
): number {
  const byBalance = Math.max(0, Math.floor(balance || 0));
  const cap = Math.floor((subtotalCents || 0) * REDEEM_MAX_FRACTION);
  const byTotal = Math.max(0, Math.floor(cap / POINT_VALUE_CENTS));
  return Math.min(byBalance, byTotal);
}
