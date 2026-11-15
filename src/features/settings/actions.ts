"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminCaller } from "@/lib/auth/require-admin";
import type { SiteSettings } from "./types";

export interface SettingsResult {
  ok: boolean;
  message: string;
}

const NO_ADMIN =
  "Persistenza non attiva: aggiungi SUPABASE_SERVICE_ROLE_KEY su Vercel.";

/** Converte "44,90" o "44.90" in centesimi; stringa vuota -> null. */
function eurosToCents(raw: string): number | null {
  const v = raw.trim().replace(",", ".");
  if (!v) return null;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
}

/** Giorni interi tra 1 e 30; valore non valido -> fallback. */
function days(raw: string, fallback: number): number {
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? Math.min(30, Math.max(1, n)) : fallback;
}

export async function saveSettings(
  _prev: SettingsResult | null,
  formData: FormData,
): Promise<SettingsResult> {
  if (!(await getAdminCaller())) {
    return { ok: false, message: "Non autorizzato." };
  }
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };

  const str = (k: string) => String(formData.get(k) ?? "").trim();

  const announcements = str("announcements")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const firstAfterDays = days(str("reminderFirstDays"), 1);
  // Il secondo promemoria parte sempre almeno un giorno dopo il primo.
  const secondAfterDays = Math.max(
    firstAfterDays + 1,
    days(str("reminderSecondDays"), 3),
  );

  const value: SiteSettings = {
    announcements,
    bank: {
      holder: str("bankHolder"),
      iban: str("bankIban").replace(/\s+/g, ""),
      bic: str("bankBic"),
      bank: str("bankName"),
    },
    crypto: {
      btc: str("btc"),
      usdtTrc20: str("usdtTrc20"),
    },
    shipping: {
      freeThresholdCents: eurosToCents(str("freeThresholdEuro")),
      note: str("shippingNote"),
    },
    reminders: {
      enabled: formData.get("reminderEnabled") === "on",
      firstAfterDays,
      secondAfterDays,
    },
    storeEmail: str("storeEmail"),
  };

  const { error } = await admin.from("settings").upsert(
    { key: "site", value, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );
  if (error) return { ok: false, message: `Errore DB: ${error.message}` };

  revalidatePath("/", "layout");
  return { ok: true, message: "Impostazioni salvate e pubblicate sul sito." };
}
