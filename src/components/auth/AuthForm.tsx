"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("auth");
  const tAcc = useTranslations("account");
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
      setError(t("notConfigured"));
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
      setError(t("captchaRequired"));
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
            ? t("invalidCredentials")
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
          {t("checkEmailTitle")}
        </h1>
        <p className="text-sm text-muted">{t("checkEmailBody")}</p>
        <Button asChild size="lg" className="mt-1">
          <Link href="/login">{t("goToLogin")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold uppercase tracking-tight">
          {isLogin ? t("loginTitle") : t("registerTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isLogin ? t("loginSubtitle") : t("registerSubtitle")}
        </p>
      </div>

      {!isLogin && (
        <Field label={t("name")} name="name" autoComplete="name" />
      )}
      <Field label={t("email")} name="email" type="email" autoComplete="email" />
      <Field
        label={t("password")}
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
        {isLogin ? tAcc("login") : tAcc("register")}
      </Button>

      <p className="text-center text-sm text-muted">
        {isLogin ? (
          <>
            {t("noAccount")}{" "}
            <Link href="/register" className="text-accent hover:underline">
              {tAcc("register")}
            </Link>
          </>
        ) : (
          <>
            {t("haveAccount")}{" "}
            <Link href="/login" className="text-accent hover:underline">
              {tAcc("login")}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
