"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, LOCALE_COOKIE } from "@/lib/constants";

export function LanguageToggle() {
  const current = useLocale();
  const router = useRouter();
  const short = LOCALES.find((l) => l.code === current)?.short ?? "IT";

  function change(value: string) {
    // Cookie leggibile lato server: al refresh il sito si ri-renderizza
    // nella lingua scelta (interfaccia; i nomi prodotto restano invariati).
    document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Cambia lingua"
        className="inline-flex h-9 items-center gap-1.5 rounded-base px-2 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Globe className="size-4" aria-hidden />
        <span className="font-medium text-white">{short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Lingua</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current} onValueChange={change}>
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
