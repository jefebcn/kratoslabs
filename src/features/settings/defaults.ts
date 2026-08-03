import { ANNOUNCEMENTS } from "@/lib/constants";
import type { SiteSettings } from "./types";

const clean = (raw: string | undefined) => (raw ?? "").trim();

/**
 * Valori di default: se l'admin non ha ancora salvato nulla su Supabase, il
 * sito usa questi. Le coordinate di pagamento continuano a poter arrivare dalle
 * env (retro-compatibilità con la configurazione precedente al pannello admin).
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  announcements: [...ANNOUNCEMENTS],
  bank: {
    holder: clean(process.env.NEXT_PUBLIC_BANK_HOLDER),
    iban: clean(process.env.NEXT_PUBLIC_BANK_IBAN).replace(/\s+/g, ""),
    bic: clean(process.env.NEXT_PUBLIC_BANK_BIC),
    bank: clean(process.env.NEXT_PUBLIC_BANK_NAME),
  },
  crypto: {
    btc:
      clean(process.env.NEXT_PUBLIC_BTC_ADDRESS) ||
      "3BprV9NXnMUXLcoXicQgeo6R15qfLCJHJf",
    usdtTrc20:
      clean(process.env.NEXT_PUBLIC_USDT_TRC20_ADDRESS) ||
      "TW4dKCiXKsGy4vdfRGpcXge9EqVpTzSx33",
  },
  shipping: {
    freeThresholdCents: null,
    note: "",
  },
  storeEmail: clean(process.env.NEXT_PUBLIC_STORE_EMAIL),
};
