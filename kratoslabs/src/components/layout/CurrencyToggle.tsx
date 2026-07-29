"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePreferences } from "@/features/preferences";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { CURRENCIES } from "@/lib/constants";
import type { CurrencyCode } from "@/types";

export function CurrencyToggle() {
  const mounted = useHasMounted();
  const currency = usePreferences((s) => s.currency);
  const setCurrency = usePreferences((s) => s.setCurrency);
  const current = mounted ? currency : "EUR";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Cambia valuta"
        className="inline-flex h-9 items-center rounded-base px-2 text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="num font-medium text-text">{current}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Valuta</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(v) => setCurrency(v as CurrencyCode)}
        >
          {Object.values(CURRENCIES).map((c) => (
            <DropdownMenuRadioItem key={c.code} value={c.code}>
              <span className="num">
                {c.symbol} {c.code}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
