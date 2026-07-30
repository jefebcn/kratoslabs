/**
 * Utility pagamenti in criptovaluta. Gli indirizzi arrivano dalle impostazioni
 * del sito (admin) o, come default, dalle env. Non sono segreti: sono indirizzi
 * di ricezione.
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

/** Costruisce la lista di asset pagabili a partire dagli indirizzi salvati. */
export function buildCryptoAssets(crypto: {
  btc?: string;
  usdtTrc20?: string;
}): CryptoAsset[] {
  const btc = (crypto.btc ?? "").trim();
  const usdt = (crypto.usdtTrc20 ?? "").trim();
  return [
    btc ? { symbol: "BTC", label: "Bitcoin", address: btc } : null,
    usdt
      ? {
          symbol: "USDT",
          label: "USDT",
          address: usdt,
          network: "TRON (TRC-20)",
        }
      : null,
  ].filter((a): a is CryptoAsset => a !== null);
}

/** URI BIP-21 per aprire il wallet con importo precompilato (solo BTC). */
export function bitcoinUri(address: string, label?: string): string {
  const params = new URLSearchParams();
  if (label) params.set("label", label);
  const q = params.toString();
  return `bitcoin:${address}${q ? `?${q}` : ""}`;
}
