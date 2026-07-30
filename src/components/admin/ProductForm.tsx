"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { saveProduct, type ActionResult } from "@/features/admin";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    saveProduct,
    null,
  );
  const s = product?.specs;
  const err = (k: string) => state?.errors?.[k]?.[0];

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-8">
      {state?.message && (
        <div
          className={cn(
            "rounded-base border px-4 py-3 text-sm",
            state.ok
              ? "border-emerald-500/40 text-emerald-400"
              : "border-danger/50 text-danger",
          )}
        >
          {state.message}
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Titolo" error={err("title")} className="sm:col-span-2">
          <Input name="title" defaultValue={product?.title} required />
        </Field>
        <Field label="Brand" error={err("brand")}>
          <Input name="brand" defaultValue={product?.brand ?? "KratosLabs"} required />
        </Field>
        <Field label="Slug" hint="es. iso-zero-whey-isolate" error={err("slug")}>
          <Input name="slug" defaultValue={product?.slug} required />
        </Field>
        <Field label="Categoria" error={err("category")}>
          <Select name="category" defaultValue={product?.category ?? "proteine"}>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Stock" error={err("stock")}>
          <Input
            name="stock"
            type="number"
            min={0}
            defaultValue={product?.stock ?? 0}
            required
          />
        </Field>
        <Field
          label="Descrizione breve"
          error={err("shortDescription")}
          className="sm:col-span-2"
        >
          <Input
            name="shortDescription"
            maxLength={160}
            defaultValue={product?.shortDescription}
            required
          />
        </Field>
        <Field
          label="Descrizione"
          error={err("description")}
          className="sm:col-span-2"
        >
          <Textarea name="description" defaultValue={product?.description} required />
        </Field>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium">Prezzo</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Prezzo (centesimi)"
            hint="es. 4490 = € 44,90"
            error={err("priceCents")}
          >
            <Input
              name="priceCents"
              type="number"
              min={0}
              defaultValue={product?.priceCents}
              required
            />
          </Field>
          <Field
            label="Prezzo pieno (centesimi)"
            hint="opzionale, per mostrare lo sconto"
            error={err("compareAtPriceCents")}
          >
            <Input
              name="compareAtPriceCents"
              type="number"
              min={0}
              defaultValue={product?.compareAtPriceCents}
            />
          </Field>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium">Dati tecnici</h3>
        <p className="mb-4 mt-1 text-xs text-muted">
          Dosaggio dichiarato e porzioni: alimentano il prezzo per grammo di
          attivo mostrato in vetrina.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Principio attivo"
            error={err("activeName")}
            className="lg:col-span-2"
          >
            <Input name="activeName" defaultValue={s?.activeName} required />
          </Field>
          <Field label="Attivo/porzione (g)" error={err("activePerServingG")}>
            <Input
              name="activePerServingG"
              type="number"
              step="0.1"
              min={0}
              defaultValue={s?.activePerServingG}
              required
            />
          </Field>
          <Field label="Porzione (g)" error={err("servingSizeG")}>
            <Input
              name="servingSizeG"
              type="number"
              step="0.1"
              min={0}
              defaultValue={s?.servingSizeG}
              required
            />
          </Field>
          <Field
            label="Porzioni/confezione"
            error={err("servingsPerContainer")}
          >
            <Input
              name="servingsPerContainer"
              type="number"
              min={0}
              defaultValue={s?.servingsPerContainer}
              required
            />
          </Field>
          <Field label="Peso netto (g)" error={err("netWeightG")}>
            <Input
              name="netWeightG"
              type="number"
              step="0.1"
              min={0}
              defaultValue={s?.netWeightG}
              required
            />
          </Field>
        </div>
      </section>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured}
          className="size-4 rounded-[3px] border-border bg-surface [accent-color:#dc2626]"
        />
        Metti in evidenza in homepage
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" loading={pending}>
          <Save className="size-4" aria-hidden />
          Salva prodotto
        </Button>
      </div>
    </form>
  );
}
