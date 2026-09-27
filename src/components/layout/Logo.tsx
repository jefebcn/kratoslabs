import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logo/wordmark ufficiale Kratos Labs (immagine orizzontale). */
export function Logo({
  className,
  imgClassName,
}: {
  className?: string;
  imgClassName?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Kratos Labs, home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/images/logo.png"
        alt="Kratos Labs"
        width={800}
        height={257}
        priority
        // Il logo non supera mai gli 80px di altezza (~250px di larghezza):
        // così l'ottimizzatore non genera varianti inutilmente grandi.
        sizes="250px"
        className={cn("h-9 w-auto sm:h-10", imgClassName)}
      />
    </Link>
  );
}
