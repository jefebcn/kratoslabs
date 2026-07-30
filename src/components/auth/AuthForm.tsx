"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  TurnstileWidget,
  turnstileEnabled,
} from "@/components/auth/TurnstileWidget";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  // Token captcha (login e registrazione, se Turnstile è configurato).
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // Cambia per forzare un nuovo challenge dopo un errore (token monouso).
  const [captchaKey, setCaptchaKey] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError(
        "Autenticazione non configurata: manca la chiave Supabase nell'ambiente.",
      );
      return;
    }

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "").trim();

    setLoading(true);
    const supabase = createClient();

    // Il captcha (se attivo su Supabase) è richiesto sia al login sia alla
    // registrazione: senza token l'endpoint auth rifiuta la richiesta.
    if (turnstileEnabled && !captchaToken) {
      setLoading(false);
      setError("Completa la verifica anti-bot qui sotto.");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken: captchaToken ?? undefined },
      });
      setLoading(false);
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Email o password non corretti."
            : error.message,
        );
        // Rigenera il captcha: il token appena usato non è più valido.
        setCaptchaToken(null);
        setCaptchaKey((k) => k + 1);
        return;
      }
      router.push(next);
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        captchaToken: captchaToken ?? undefined,
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      // Rigenera il captcha: il token appena usato non è più valido.
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
      return;
    }

    // Se la conferma email è disattivata su Supabase, la sessione è già attiva.
    if (data.session) {
      router.push(next);
      router.refresh();
      return;
    }

    setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-semibold uppercase tracking-tight">
          Controlla la tua email
        </h1>
        <p className="text-sm text-muted">
          Ti abbiamo inviato un link di conferma. Aprilo per attivare
          l&apos;account, poi torna qui per accedere.
        </p>
        <Button asChild size="lg" className="mt-1">
          <Link href="/login">Vai al login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold uppercase tracking-tight">
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

      <TurnstileWidget key={captchaKey} onToken={setCaptchaToken} />

      {error && (
        <p className="rounded-base border border-danger/30 bg-accent-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={loading}>
        {isLogin ? "Accedi" : "Registrati"}
      </Button>

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
