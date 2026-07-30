"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Da collegare al provider di autenticazione.
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">
          {isLogin ? "Accedi" : "Crea un account"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isLogin ? "Bentornato." : "Bastano pochi secondi."}
        </p>
      </div>

      {!isLogin && <Field label="Nome" name="name" autoComplete="name" />}
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={isLogin ? "current-password" : "new-password"}
      />

      <Button type="submit" size="lg">
        {isLogin ? "Accedi" : "Registrati"}
      </Button>

      {submitted && (
        <p className="text-xs text-muted">
          {"Demo: l'autenticazione non è ancora collegata."}
        </p>
      )}

      <p className="text-center text-sm text-muted">
        {isLogin ? (
          <>
            Non hai un account?{" "}
            <Link href="/register" className="text-accent hover:underline">
              Registrati
            </Link>
          </>
        ) : (
          <>
            Hai già un account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Accedi
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
