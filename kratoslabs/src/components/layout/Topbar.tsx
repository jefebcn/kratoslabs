import { FlaskConical, RotateCcw, Truck } from "lucide-react";
import { ANNOUNCEMENTS } from "@/lib/constants";

const ICONS = [FlaskConical, Truck, RotateCcw];

export function Topbar() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-xs text-muted">
        {ANNOUNCEMENTS.map((text, i) => {
          const Icon = ICONS[i] ?? FlaskConical;
          return (
            <span key={text} className="inline-flex items-center gap-1.5">
              <Icon className="size-3.5 text-accent" aria-hidden />
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
