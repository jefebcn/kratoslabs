/**
 * Tracciamento spedizioni tramite 17TRACK.
 *
 * Il link pubblico funziona SENZA API key (basta il codice). L'API di 17TRACK
 * (registrazione + stato in tempo reale) è opzionale e va guardata dalla
 * variabile d'ambiente SEVENTEENTRACK_API_KEY (impostata su Vercel, mai nel codice).
 */
const SEVENTEENTRACK_API_KEY = (process.env.SEVENTEENTRACK_API_KEY ?? "").trim();

/** true se l'integrazione API 17TRACK è configurata. */
export const isTrackingApiConfigured = Boolean(SEVENTEENTRACK_API_KEY);

/** URL pubblico di 17TRACK per un codice di tracciamento (nessuna API richiesta). */
export function trackingUrl(trackingId: string): string {
  return `https://t.17track.net/en#nums=${encodeURIComponent(trackingId.trim())}`;
}
