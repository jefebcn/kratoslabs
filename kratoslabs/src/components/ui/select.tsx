import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Select nativo stilizzato. Per i form dell'admin un <select> nativo è più
 * accessibile e leggero di un menu custom; manteniamo l'estetica dei token.
 */
export function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-base border border-border bg-surface px-3 pr-9 text-sm text-text",
          "focus-visible:border-accent focus-visible:outline-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}
