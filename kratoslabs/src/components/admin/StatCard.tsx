import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardMetric } from "@/types";

export function StatCard({ metric }: { metric: DashboardMetric }) {
  const tone =
    metric.trend === "up"
      ? "text-emerald-400"
      : metric.trend === "down"
        ? "text-danger"
        : "text-muted";

  const Arrow =
    metric.deltaPct > 0
      ? ArrowUpRight
      : metric.deltaPct < 0
        ? ArrowDownRight
        : Minus;

  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-muted">
        {metric.label}
      </p>
      <p className="num mt-2 text-2xl font-semibold">{metric.value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <span className={cn("num inline-flex items-center gap-0.5", tone)}>
          <Arrow className="size-3.5" aria-hidden />
          {Math.abs(metric.deltaPct)}%
        </span>
        <span className="text-muted">{metric.hint}</span>
      </div>
    </Card>
  );
}
