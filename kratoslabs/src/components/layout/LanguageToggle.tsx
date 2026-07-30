"use client";

import { Globe } from "lucide-react";
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
import { LOCALES } from "@/lib/constants";
import type { LocaleCode } from "@/types";

export function LanguageToggle() {
  const mounted = useHasMounted();
  const locale = usePreferences((s) => s.locale);
  const setLocale = usePreferences((s) => s.setLocale);
  const current = mounted ? locale : "it";
  const short = LOCALES.find((l) => l.code === current)?.short ?? "IT";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Cambia lingua"
        className="inline-flex h-9 items-center gap-1.5 rounded-base px-2 text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Globe className="size-4" aria-hidden />
        <span className="font-medium text-text">{short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Lingua</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(v) => setLocale(v as LocaleCode)}
        >
          {LOCALES.map((l) => (
            <DropdownMenuRadioItem key={l.code} value={l.code}>
              {l.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
