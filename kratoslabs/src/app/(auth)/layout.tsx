import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
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
