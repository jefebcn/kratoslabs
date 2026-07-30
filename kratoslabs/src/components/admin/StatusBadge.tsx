import { ORDER_STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META.find((m) => m.status === status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-base border px-2 py-0.5 text-xs font-medium",
        meta?.tone ?? "border-border text-muted",
      )}
    >
      {meta?.label ?? status}
    </span>
  );
}
