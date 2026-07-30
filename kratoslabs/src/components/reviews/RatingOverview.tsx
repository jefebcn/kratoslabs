import { Stars } from "@/components/reviews/Stars";
import { cn } from "@/lib/utils";

export function RatingOverview({
  average,
  count,
  className,
}: {
  average: number;
  count: number;
  className?: string;
}) {
  if (count === 0) {
    return (
      <p className={cn("text-sm text-muted", className)}>
        Ancora nessuna recensione.
      </p>
    );
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="num text-3xl font-semibold text-accent">
        {average.toFixed(1).replace(".", ",")}
      </span>
      <div>
        <Stars rating={Math.round(average)} />
        <p className="num mt-1 text-xs text-muted">
          su {count} recensioni verificate
        </p>
      </div>
    </div>
  );
}
