/**
 * Utility bonifico bancario. Le coordinate (IBAN, beneficiario) arrivano dalle
 * impostazioni del sito (admin) o, come default, dalle env. Non sono segrete:
 * sono i dati per ricevere un pagamento.
 */
export interface BankConfig {
  holder: string;
  iban: string;
  bic: string;
  bank: string;
}

/** Un bonifico è mostrabile solo con IBAN + intestatario presenti. */
export function isBankComplete(b: BankConfig): boolean {
  return Boolean(b.iban && b.holder);
}

/** IBAN formattato a gruppi di 4 per la lettura. */
export function formatIban(iban: string): string {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}
