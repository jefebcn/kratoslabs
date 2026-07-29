"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Form di ricerca riutilizzabile: header desktop e drawer mobile. */
export function SearchForm({
  autoFocus,
  onSubmitted,
}: {
  autoFocus?: boolean;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
    onSubmitted?.();
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <Input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cerca proteine, creatina…"
        aria-label="Cerca prodotti"
        className="pl-9"
      />
    </form>
  );
}

export function SearchBar() {
  return (
    <div className="hidden w-full max-w-xs md:block">
      <SearchForm />
    </div>
  );
}
