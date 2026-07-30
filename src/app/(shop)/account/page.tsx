import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, isAdminUser } from "@/lib/supabase/config";
import { signOut } from "@/features/auth/actions";

export const metadata: Metadata = {
  title: "Il mio account",
  robots: { index: false },
};

export default async function AccountPage() {
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const name = (user.user_metadata?.full_name as string | undefined) ?? null;
  const admin = isAdminUser(user);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="Area riservata" title="Il mio account" />

      <div className="mt-8 rounded-base border border-border bg-surface p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {name && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Nome</dt>
              <dd className="mt-1 font-medium">{name}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Email</dt>
            <dd className="mt-1 font-medium break-all">{user.email}</dd>
          </div>
        </dl>

        {admin && (
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-base border border-accent/30 bg-accent-soft px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            <ShieldCheck className="size-4" aria-hidden />
            Vai alla dashboard admin
          </Link>
        )}
      </div>

      <form action={signOut} className="mt-6">
        <Button type="submit" variant="outline" size="lg">
          Esci dall&apos;account
        </Button>
      </form>
    </div>
  );
}
