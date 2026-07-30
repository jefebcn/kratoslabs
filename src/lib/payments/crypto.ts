/**
 * Configurazione pagamenti in criptovaluta.
 * Gli indirizzi arrivano dalle env (pubbliche: sono indirizzi di ricezione).
 * SICUREZZA: se un indirizzo non è configurato NON viene mostrato nulla di
 * pagabile — così nessuno può inviare fondi a un indirizzo placeholder.
 */
export interface CryptoAsset {
  symbol: string;
  label: string;
  address: string;
  /** Rete da specificare all'utente (es. TRC-20). */
  network?: string;
}

const BTC = (process.env.NEXT_PUBLIC_BTC_ADDRESS ?? "").trim();
const USDT_TRC20 = (process.env.NEXT_PUBLIC_USDT_TRC20_ADDRESS ?? "").trim();

export const CRYPTO_ASSETS: CryptoAsset[] = [
  BTC ? { symbol: "BTC", label: "Bitcoin", address: BTC } : null,
  USDT_TRC20
    ? {
        symbol: "USDT",
        label: "USDT",
        address: USDT_TRC20,
        network: "TRON (TRC-20)",
      }
    : null,
].filter((a): a is CryptoAsset => a !== null);

export const isCryptoConfigured = CRYPTO_ASSETS.length > 0;

/** URI BIP-21 per aprire il wallet con importo precompilato (solo BTC). */
export function bitcoinUri(address: string, label?: string): string {
  const params = new URLSearchParams();
  if (label) params.set("label", label);
  const q = params.toString();
  return `bitcoin:${address}${q ? `?${q}` : ""}`;
}
