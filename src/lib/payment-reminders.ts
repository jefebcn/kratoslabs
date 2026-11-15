/**
 * Quando mandare un promemoria di pagamento (logica pura, testabile).
 * Il primo dopo `firstAfterDays` giorni dall'ordine; il secondo, ultimo,
 * dopo `secondAfterDays` giorni e mai a meno di 20 ore dall'ultimo contatto
 * (promemoria precedente o dati rimandati a mano dall'admin).
 */

export const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
/**
 * Il controllo gira una volta al giorno (mattina): senza margine un ordine
 * delle 11 di ieri avrebbe "solo" 22 ore e il promemoria slitterebbe di un
 * giorno intero. Con 12 ore di margine "1 giorno" vuol dire "la mattina dopo".
 */
const SLACK_MS = 12 * HOUR_MS;
/** Distanza minima tra due contatti allo stesso cliente. */
const MIN_GAP_MS = 20 * HOUR_MS;

export type ReminderVariant = "reminder" | "final";

export function reminderDue(
  order: {
    /** Data dell'ordine (ms). */
    created: number;
    /** Date (ms) dei promemoria già inviati. */
    sent: number[];
    /** Ultimo reinvio manuale dei dati dall'admin (ms), 0 se mai. */
    resentAt: number;
  },
  settings: { firstAfterDays: number; secondAfterDays: number },
  now: number,
): ReminderVariant | null {
  if (!order.created) return null;
  const age = now - order.created;
  const lastContact = Math.max(order.created, order.resentAt, ...order.sent);
  if (order.sent.length === 0 && age >= settings.firstAfterDays * DAY_MS - SLACK_MS) {
    return "reminder";
  }
  if (
    order.sent.length === 1 &&
    age >= settings.secondAfterDays * DAY_MS - SLACK_MS &&
    now - lastContact >= MIN_GAP_MS
  ) {
    return "final";
  }
  return null;
}
