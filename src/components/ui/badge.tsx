import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "outline" | "danger" | "success";

const variants: Record<BadgeVariant, string> = {
  default: "border-transparent bg-surface-2 text-text",
  accent: "border-accent/30 bg-accent-soft text-accent",
  outline: "border-border bg-transparent text-muted",
  danger: "border-danger/40 bg-transparent text-danger",
  success: "border-emerald-500/40 bg-transparent text-emerald-400",
};

export interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-base border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
