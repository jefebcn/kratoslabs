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
