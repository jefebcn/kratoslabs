"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@/lib/constants";
import type { CurrencyCode, LocaleCode } from "@/types";

interface PreferencesState {
  currency: CurrencyCode;
  locale: LocaleCode;
  setCurrency: (currency: CurrencyCode) => void;
  setLocale: (locale: LocaleCode) => void;
}

/**
 * Valuta e lingua scelte dall'utente. La valuta è solo di visualizzazione:
 * il prezzo canonico resta in centesimi di euro (vedi `formatMoney`).
 */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: DEFAULT_CURRENCY,
      locale: DEFAULT_LOCALE,
      setCurrency: (currency) => set({ currency }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: "kratoslabs.preferences" },
  ),
);
