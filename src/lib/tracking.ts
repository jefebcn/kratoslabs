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

const API_BASE = "https://api.17track.net/track/v2.2";

async function call17(
  path: string,
  body: unknown,
): Promise<Record<string, unknown> | null> {
  if (!isTrackingApiConfigured) return null;
  try {
    const res = await fetch(`${API_BASE}/${path}`, {
      method: "POST",
      headers: {
        "17token": SEVENTEENTRACK_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Registra un codice presso 17TRACK (best-effort). Da chiamare quando l'ordine
 * viene spedito, così 17TRACK inizia a seguirlo. Idempotente lato 17TRACK.
 */
export async function registerTracking(number: string): Promise<boolean> {
  const num = number.trim();
  if (!num) return false;
  const json = await call17("register", [{ number: num }]);
  return Boolean(json && (json as { code?: number }).code === 0);
}

export interface TrackInfo {
  /** Stato normalizzato 17TRACK (es. InTransit, Delivered, Exception…). */
  status: string;
  /** Descrizione dell'ultimo evento (dal corriere). */
  description?: string;
  /** Località dell'ultimo evento. */
  location?: string;
  /** Timestamp ISO dell'ultimo evento. */
  timeIso?: string;
}

/** Stato di tracciamento corrente per un codice (null se non disponibile). */
export async function getTrackingInfo(
  number: string,
): Promise<TrackInfo | null> {
  const num = number.trim();
  if (!num) return null;
  const json = await call17("gettrackinfo", [{ number: num }]);
  if (!json) return null;
  const data = json.data as
    | { accepted?: Array<{ track_info?: Record<string, unknown> }> }
    | undefined;
  const ti = data?.accepted?.[0]?.track_info as
    | {
        latest_status?: { status?: string };
        latest_event?: {
          description?: string;
          location?: string;
          time_iso?: string;
        };
      }
    | undefined;
  if (!ti) return null;
  const ev = ti.latest_event ?? {};
  return {
    status: ti.latest_status?.status || "NotFound",
    description: ev.description,
    location: ev.location,
    timeIso: ev.time_iso,
  };
}
