import { BULK_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Tabella informativa degli sconti quantità. `activeQuantity` evidenzia la riga raggiunta. */
export function BulkPricingTable({
  activeQuantity,
  className,
}: {
  activeQuantity?: number;
  className?: string;
}) {
  return (
    <div className={cn("rounded-base border border-border", className)}>
      {BULK_TIERS.map((tier, i) => {
        const reached =
          activeQuantity !== undefined && activeQuantity >= tier.minQuantity;
        return (
          <div
            key={tier.minQuantity}
            className={cn(
              "flex items-center justify-between px-4 py-2.5 text-sm",
              i > 0 && "border-t border-border",
              reached && "bg-accent-soft/60",
            )}
          >
            <span className="text-muted">
              Da{" "}
              <span className="num font-medium text-text">
                {tier.minQuantity}
              </span>{" "}
              pezzi
            </span>
            <span
              className={cn(
                "num font-medium",
                reached ? "text-accent" : "text-text",
              )}
            >
              −{Math.round(tier.discount * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
