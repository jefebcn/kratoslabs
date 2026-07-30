import { cn } from "@/lib/utils";
import { Meander } from "@/components/ui/Meander";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display mt-2 text-2xl font-semibold uppercase tracking-tight text-balance sm:text-3xl">
        {title}
      </h2>
      {/* Accento greco, come il bordo del logo */}
      <Meander
        units={4}
        className={cn("mt-3 text-accent", align === "center" && "mx-auto")}
      />
      {description && (
        <p className="mt-3 text-muted text-pretty">{description}</p>
      )}
    </div>
  );
}
