"use client";

import { usePreferences } from "@/features/preferences";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { cn, formatMoney } from "@/lib/utils";

/**
 * Prezzo formattato nella valuta scelta. Prima del mount usa EUR (il default
 * lato server) per non generare mismatch di idratazione.
 */
export function Money({
  cents,
  className,
}: {
  cents: number;
  className?: string;
}) {
  const mounted = useHasMounted();
  const currency = usePreferences((s) => s.currency);
  return (
    <span className={cn("num", className)}>
      {formatMoney(cents, mounted ? currency : "EUR")}
    </span>
  );
}
