export interface BankSettings {
  holder: string;
  iban: string;
  bic: string;
  bank: string;
}

export interface CryptoSettings {
  btc: string;
  usdtTrc20: string;
}

export interface ShippingSettings {
  /** Soglia in centesimi per la spedizione gratuita (null = nessuna). */
  freeThresholdCents: number | null;
  note: string;
}

/** Promemoria automatici per gli ordini con bonifico non ancora pagati. */
export interface ReminderSettings {
  enabled: boolean;
  /** Giorni dall'ordine dopo cui parte il primo promemoria. */
  firstAfterDays: number;
  /** Giorni dall'ordine dopo cui parte il secondo (e ultimo) promemoria. */
  secondAfterDays: number;
}

export interface SiteSettings {
  announcements: string[];
  bank: BankSettings;
  crypto: CryptoSettings;
  shipping: ShippingSettings;
  reminders: ReminderSettings;
  storeEmail: string;
}
