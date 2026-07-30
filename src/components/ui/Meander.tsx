import { cn } from "@/lib/utils";

/**
 * Greca (meandro) decorativa in stile logo Kratos Labs.
 * Linea continua + uncini ripetuti: legge come bordo greco classico.
 * Il colore segue `currentColor` (usa una classe text-* sul chiamante).
 */
export function Meander({
  units = 6,
  className,
}: {
  units?: number;
  className?: string;
}) {
  const U = 12; // larghezza di un'unità
  const w = units * U;

  const hooks: string[] = [];
  for (let i = 0; i < units; i++) {
    const x = i * U;
    // uncino a spirale che parte dalla base
    hooks.push(`M${x} 10 L${x} 2 L${x + 8} 2 L${x + 8} 8 L${x + 4} 8 L${x + 4} 6`);
  }
  const d = `M0 10 H${w} ` + hooks.join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} 12`}
      width={w}
      height={12}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="square"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}
