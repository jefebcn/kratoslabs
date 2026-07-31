/**
 * Regole del programma punti (Reward Points). Valori puri, usabili sia lato
 * client sia lato server.
 *
 *  - Guadagno: 5 punti ogni 25€ spesi (≈ 1 punto ogni 5€).
 *  - Valore: 100 punti = 25€ di sconto (1 punto = 0,25€).
 */
export const POINT_VALUE_CENTS = 25; // 1 punto = 0,25 €
export const EARN_DIVISOR_CENTS = 500; // 1 punto ogni 5€ → 5 punti / 25€

/** Punti guadagnati per un ordine di `cents` (arrotondati per difetto). */
export function pointsEarnedFor(cents: number): number {
  if (!Number.isFinite(cents) || cents <= 0) return 0;
  return Math.floor(cents / EARN_DIVISOR_CENTS);
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
 * Punti massimi spendibili: non oltre il saldo, e mai tanti da scontare più del
 * subtotale (lo sconto non può superare l'importo dell'ordine).
 */
export function maxRedeemablePoints(
  balance: number,
  subtotalCents: number,
): number {
  const byBalance = Math.max(0, Math.floor(balance || 0));
  const byTotal = Math.max(0, Math.floor((subtotalCents || 0) / POINT_VALUE_CENTS));
  return Math.min(byBalance, byTotal);
}
