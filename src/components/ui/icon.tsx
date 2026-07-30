import {
  Bitcoin,
  CreditCard,
  FlaskConical,
  Landmark,
  ShieldCheck,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** Nomi icona usati nei dati (constants). Risolti qui in un solo punto. */
const ICONS: Record<string, LucideIcon> = {
  FlaskConical,
  Truck,
  ShieldCheck,
  CreditCard,
  Wallet,
  Landmark,
  Bitcoin,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? FlaskConical;
  return <Cmp className={className} aria-hidden />;
}
