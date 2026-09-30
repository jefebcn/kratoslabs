"use client";

import { useEffect, useRef } from "react";

/**
 * Widget Cloudflare Turnstile (captcha anti-bot). Si attiva solo se è impostata
 * la variabile pubblica NEXT_PUBLIC_TURNSTILE_SITE_KEY: altrimenti non renderizza
 * nulla, così il form resta funzionante finché il captcha non è configurato.
 *
 * Il token va passato a Supabase (auth.signUp options.captchaToken); la verifica
 * avviene lato Supabase, dove va incollata la Secret key con provider Turnstile.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      /** Riceve il codice d'errore client-side di Turnstile. */
      "error-callback"?: (code?: string | number) => void;
    },
  ) => string;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function TurnstileWidget({
  onToken,
  onError,
}: {
  onToken: (token: string | null) => void;
  /**
   * Chiamato quando il widget non riesce a produrre un token: con il codice
   * d'errore di Cloudflare (es. "110200" = dominio non autorizzato nel pannello
   * Turnstile) oppure "script" se `api.js` non si carica (rete, ad-blocker).
   * Senza questo callback l'errore restava invisibile: l'utente vedeva uno
   * spazio vuoto e il form gli chiedeva di completare una verifica inesistente.
   */
  onError?: (code: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": (code) => {
          onToken(null);
          // Il codice finisce anche in console, così è leggibile dagli strumenti
          // di sviluppo senza dover riprodurre il problema.
          console.warn(`[Turnstile] errore ${code}`);
          onError?.(String(code ?? "unknown"));
        },
      });
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.getElementById(
        SCRIPT_ID,
      ) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
      // Script bloccato (ad-blocker, rete, firewall): senza questo il widget
      // restava uno spazio vuoto senza alcuna spiegazione.
      script.addEventListener("error", () => {
        if (cancelled) return;
        onToken(null);
        onError?.("script");
      });
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // widget già rimosso
        }
        widgetIdRef.current = null;
      }
    };
  }, [onToken, onError]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="min-h-[65px]" />;
}

/** true se il captcha è configurato (chiave pubblica presente). */
export const turnstileEnabled = Boolean(SITE_KEY);
