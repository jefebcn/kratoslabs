"use client";

import { useEffect, useState } from "react";

/**
 * True solo dopo il primo mount lato client. Serve a evitare mismatch di
 * idratazione quando renderizziamo valori che dipendono da stato persistito
 * (carrello, valuta) diverso dal default usato sul server.
 */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
