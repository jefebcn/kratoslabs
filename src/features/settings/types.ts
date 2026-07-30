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

export interface SiteSettings {
  announcements: string[];
  bank: BankSettings;
  crypto: CryptoSettings;
  shipping: ShippingSettings;
  storeEmail: string;
}
