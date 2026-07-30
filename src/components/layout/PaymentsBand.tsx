import {
  Bitcoin,
  CircleDollarSign,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { ACCEPTED_PAYMENTS } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  Bitcoin,
  CircleDollarSign,
  Landmark,
};

function Item({
  name,
  subtitle,
  icon,
}: {
  name: string;
  subtitle: string;
  icon: string;
}) {
  const Icon = ICONS[icon] ?? Bitcoin;
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-accent">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="font-display text-sm font-semibold uppercase tracking-wide">
        {name}
      </span>
      <span className="text-xs text-white/50">{subtitle}</span>
    </span>
  );
}

/**
 * Banda "Accettiamo" scura con i metodi che scorrono in continuo (marquee),
 * così si vedono tutti a colpo d'occhio. Due copie della lista per il loop.
 */
export function PaymentsBand() {
  const loop = [...ACCEPTED_PAYMENTS, ...ACCEPTED_PAYMENTS];

  return (
    <section className="mt-1.5 border-y border-black/10 bg-[#15181d] text-white lg:mt-2">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
          Accettiamo
        </span>
        <span className="h-6 w-px shrink-0 bg-white/15" />

        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap will-change-transform">
            {loop.map((m, i) => (
              <Item
                key={i}
                name={m.name}
                subtitle={m.subtitle}
                icon={m.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
