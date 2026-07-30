"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Da collegare al provider email. Per ora conferma soltanto.
    setDone(true);
  }

  if (done) {
    return (
      <p className="inline-flex items-center gap-2 text-sm text-accent">
        <Check className="size-4" aria-hidden />
        Iscrizione registrata. Grazie.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        required
        placeholder="La tua email"
        aria-label="Email per la newsletter"
        className="sm:max-w-xs"
      />
      <Button type="submit">Iscriviti</Button>
    </form>
  );
}
