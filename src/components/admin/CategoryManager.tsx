"use client";

import { useActionState } from "react";
import { Plus, Eye, EyeOff, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveCategory,
  renameCategory,
  toggleCategory,
  deleteCategory,
  type CategoryResult,
} from "@/features/categories";
import { cn } from "@/lib/utils";

interface Row {
  slug: string;
  name: string;
  description: string;
  active: boolean;
}

export function CategoryManager({ categories }: { categories: Row[] }) {
  const [state, addAction, pending] = useActionState<
    CategoryResult | null,
    FormData
  >(saveCategory, null);

  return (
    <div className="flex flex-col gap-8">
      {/* Aggiungi categoria */}
      <form
        action={addAction}
        className="rounded-base border border-border bg-surface p-5"
      >
        <h2 className="text-sm font-medium">Nuova categoria</h2>
        {state?.message && (
          <p
            className={cn(
              "mt-2 text-sm",
              state.ok ? "text-emerald-600" : "text-danger",
            )}
          >
            {state.message}
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Input name="name" placeholder="Nome (es. Vitamine)" required />
          <Input name="slug" placeholder="slug (es. vitamine)" required />
          <Input name="description" placeholder="Descrizione breve" />
        </div>
        <Button type="submit" className="mt-4" loading={pending}>
          <Plus className="size-4" aria-hidden />
          Aggiungi
        </Button>
      </form>

      {/* Elenco categorie */}
      <div className="overflow-hidden rounded-base border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Stato</th>
              <th className="px-4 py-3 text-right font-medium">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.slug} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <form
                    action={renameCategory}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <input type="hidden" name="slug" value={c.slug} />
                    <Input
                      name="name"
                      defaultValue={c.name}
                      className="h-9 w-40"
                    />
                    <Input
                      name="description"
                      defaultValue={c.description}
                      className="h-9 w-56"
                      placeholder="Descrizione"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-base border border-border px-2 py-1.5 text-xs font-medium transition-colors hover:text-accent"
                    >
                      <Check className="size-3.5" aria-hidden />
                      Salva
                    </button>
                    <span className="text-xs text-muted">/{c.slug}</span>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-base border px-1.5 py-0.5 text-xs",
                      c.active
                        ? "border-emerald-500/40 text-emerald-600"
                        : "border-border text-muted",
                    )}
                  >
                    {c.active ? "Attiva" : "Nascosta"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <form action={toggleCategory}>
                      <input type="hidden" name="slug" value={c.slug} />
                      <input
                        type="hidden"
                        name="active"
                        value={String(c.active)}
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 text-muted transition-colors hover:text-text"
                      >
                        {c.active ? (
                          <>
                            <EyeOff className="size-3.5" aria-hidden /> Nascondi
                          </>
                        ) : (
                          <>
                            <Eye className="size-3.5" aria-hidden /> Mostra
                          </>
                        )}
                      </button>
                    </form>
                    <form action={deleteCategory}>
                      <input type="hidden" name="slug" value={c.slug} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 text-muted transition-colors hover:text-danger"
                        aria-label={`Elimina ${c.name}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden /> Elimina
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
