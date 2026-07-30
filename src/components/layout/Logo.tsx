import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="KratosLabs, home"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span className="grid size-7 place-items-center rounded-[3px] border border-border bg-surface">
        <svg width="16" height="16" viewBox="0 0 32 32" aria-hidden fill="none">
          <path
            d="M11 8v16M11 16l8-8M11 16l8 8"
            stroke="#C9A227"
            strokeWidth="2.6"
            strokeLinecap="square"
          />
        </svg>
      </span>
      <span className="text-base font-semibold tracking-tight">
        Kratos<span className="text-accent">Labs</span>
      </span>
    </Link>
  );
}
