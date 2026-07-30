import { createReadClient } from "@/lib/supabase/read";
import { DEFAULT_SETTINGS } from "./defaults";
import type { SiteSettings } from "./types";

/** Fonde i valori salvati sopra i default, campo per campo. */
function merge(
  base: SiteSettings,
  over: Partial<SiteSettings> | null | undefined,
): SiteSettings {
  if (!over || typeof over !== "object") return base;
  return {
    announcements:
      Array.isArray(over.announcements) && over.announcements.length > 0
        ? over.announcements.filter((s) => typeof s === "string" && s.trim())
        : base.announcements,
    bank: { ...base.bank, ...(over.bank ?? {}) },
    crypto: { ...base.crypto, ...(over.crypto ?? {}) },
    shipping: { ...base.shipping, ...(over.shipping ?? {}) },
    storeEmail:
      typeof over.storeEmail === "string" ? over.storeEmail : base.storeEmail,
  };
}

/**
 * Impostazioni del sito: legge la riga 'site' da Supabase e la fonde sui
 * default. Fallback totale ai default se Supabase non è configurato o la
 * lettura fallisce — il sito resta sempre navigabile.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const sb = createReadClient();
  if (!sb) return DEFAULT_SETTINGS;
  try {
    const { data, error } = await sb
      .from("settings")
      .select("value")
      .eq("key", "site")
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return merge(DEFAULT_SETTINGS, data.value as Partial<SiteSettings>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}
