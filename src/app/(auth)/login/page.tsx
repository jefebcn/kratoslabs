import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Accedi",
  robots: { index: false },
};

// Chi è già collegato viene reindirizzato dal middleware (a ?next= o
// all'account): la pagina resta statica e si apre all'istante dal menu.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
