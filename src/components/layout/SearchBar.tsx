"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex h-10 w-full items-center overflow-hidden rounded-full border border-border bg-surface focus-within:border-accent"
    >
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ricerca…"
        aria-label="Cerca prodotti"
        className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-text outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        aria-label="Cerca"
        className="grid h-full w-11 shrink-0 place-items-center border-l border-border text-muted transition-colors hover:text-accent"
      >
        <Search className="size-4" aria-hidden />
      </button>
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
