import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          aria-label="Kratos Labs, home"
          className="mx-auto block w-fit"
        >
          <Image
            src="/images/logo.png"
            alt="Kratos Labs"
            width={144}
            height={136}
            priority
            className="rounded-base border border-border"
          />
        </Link>
        <div className="mt-8 rounded-base border border-border bg-surface p-6">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-text">
            ← Torna allo store
          </Link>
        </p>
      </div>
    </div>
  );
}
