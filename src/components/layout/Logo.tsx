import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark KRATOS (bianco) + LABS (rosso) con emblema beuta. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kratos Labs, home"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-[4px] border border-[#15181d] bg-[#15181d]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 3.5h6M10.2 3.7v5.3L5.9 17.4a1.7 1.7 0 0 0 1.5 2.6h9.2a1.7 1.7 0 0 0 1.5-2.6L13.8 9V3.7"
            stroke="#CBD1D9"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M8.1 13.7h7.8l1.6 3.1a1.7 1.7 0 0 1-1.5 2.6H8a1.7 1.7 0 0 1-1.5-2.6z"
            fill="#DC2626"
          />
        </svg>
      </span>
      <span className="text-base font-bold uppercase tracking-[0.14em]">
        <span className="text-text">Kratos</span>{" "}
        <span className="text-accent">Labs</span>
      </span>
    </Link>
  );
}
