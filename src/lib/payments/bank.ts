/**
 * Configurazione bonifico bancario.
 * I dati (IBAN, beneficiario) arrivano dalle env: non sono segreti (sono i
 * dati per ricevere un pagamento). Se mancano, il checkout non mostra alcun
 * IBAN — nessun rischio di bonifici verso coordinate sbagliate.
 */
export const BANK = {
  iban: (process.env.NEXT_PUBLIC_BANK_IBAN ?? "").trim().replace(/\s+/g, ""),
  holder: (process.env.NEXT_PUBLIC_BANK_HOLDER ?? "").trim(),
  bank: (process.env.NEXT_PUBLIC_BANK_NAME ?? "").trim(),
  bic: (process.env.NEXT_PUBLIC_BANK_BIC ?? "").trim(),
};

export const isBankConfigured = Boolean(BANK.iban && BANK.holder);

/** IBAN formattato a gruppi di 4 per la lettura. */
export function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}
