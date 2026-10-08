import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/supabase/server";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = {
  title: "Registrati",
  robots: { index: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Già collegato: niente form, si va dritti a destinazione (o all'account).
  if (await getCurrentUser()) {
    const { next } = await searchParams;
    redirect(safeNext(next, "/account"));
  }
  return (
    <Suspense fallback={null}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
