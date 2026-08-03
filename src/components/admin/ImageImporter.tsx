"use client";

import { useMemo, useRef, useState } from "react";
import { Check, DownloadCloud, Loader2, RefreshCw, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  importProductImage,
  importProductImageFromUrl,
  uploadProductImage,
} from "@/features/admin";
import { cn } from "@/lib/utils";

interface Row {
  slug: string;
  title: string;
  imageUrl: string | null;
}

type State = "idle" | "loading" | "ok" | "error";
interface Status {
  state: State;
  message?: string;
  imageUrl?: string;
}

const POOL = 3;

export function ImageImporter({ products }: { products: Row[] }) {
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [onlyMissing, setOnlyMissing] = useState(true);

  const imageOf = (r: Row) => status[r.slug]?.imageUrl ?? r.imageUrl;
  const hasImage = (r: Row) => Boolean(imageOf(r));

  const visible = useMemo(
    () => products.filter((r) => (onlyMissing ? !hasImage(r) : true)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, onlyMissing, status],
  );
  const missingCount = products.filter((r) => !hasImage(r)).length;

  async function runAuto(slug: string) {
    setStatus((s) => ({ ...s, [slug]: { state: "loading" } }));
    try {
      const res = await importProductImage(slug);
      setStatus((s) => ({
        ...s,
        [slug]: {
          state: res.ok ? "ok" : "error",
          message: res.message,
          imageUrl: res.imageUrl,
        },
      }));
    } catch {
      setStatus((s) => ({
        ...s,
        [slug]: { state: "error", message: "Operazione non riuscita." },
      }));
    }
  }

  async function runManual(slug: string, url: string) {
    setStatus((s) => ({ ...s, [slug]: { state: "loading" } }));
    try {
      const res = await importProductImageFromUrl(slug, url);
      setStatus((s) => ({
        ...s,
        [slug]: {
          state: res.ok ? "ok" : "error",
          message: res.message,
          imageUrl: res.imageUrl,
        },
      }));
    } catch {
      setStatus((s) => ({
        ...s,
        [slug]: { state: "error", message: "Operazione non riuscita." },
      }));
    }
  }

  async function runUpload(slug: string, file: File) {
    if (file.size > 15 * 1024 * 1024) {
      setStatus((s) => ({
        ...s,
        [slug]: { state: "error", message: "File troppo grande (max 15 MB)." },
      }));
      return;
    }
    setStatus((s) => ({ ...s, [slug]: { state: "loading" } }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadProductImage(slug, fd);
      setStatus((s) => ({
        ...s,
        [slug]: {
          state: res.ok ? "ok" : "error",
          message: res.message,
          imageUrl: res.imageUrl,
        },
      }));
    } catch {
      setStatus((s) => ({
        ...s,
        [slug]: {
          state: "error",
          message: "Caricamento non riuscito (file troppo grande o rete).",
        },
      }));
    }
  }

  async function downloadAllMissing() {
    const queue = products.filter((r) => !hasImage(r)).map((r) => r.slug);
    if (queue.length === 0) return;
    setRunning(true);
    let done = 0;
    setProgress({ done, total: queue.length });
    let i = 0;
    const worker = async () => {
      while (i < queue.length) {
        const slug = queue[i++];
        if (!slug) continue;
        await runAuto(slug);
        done += 1;
        setProgress({ done, total: queue.length });
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(POOL, queue.length) }, worker),
    );
    setRunning(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-base border border-border bg-surface p-4">
        <div>
          <p className="text-sm font-medium">
            {missingCount} prodotti senza immagine
          </p>
          <p className="text-xs text-muted">
            Scarica le foto ufficiali da DeusMedical e le salva su Supabase.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={onlyMissing}
              onChange={(e) => setOnlyMissing(e.target.checked)}
              className="size-4 [accent-color:#dc2626]"
            />
            Solo senza immagine
          </label>
          <Button
            type="button"
            onClick={downloadAllMissing}
            loading={running}
            disabled={missingCount === 0}
          >
            <DownloadCloud className="size-4" aria-hidden />
            Scarica tutte le mancanti
          </Button>
        </div>
      </div>

      {progress && (
        <p className="num text-sm text-muted">
          {progress.done}/{progress.total} elaborati…
        </p>
      )}

      <div className="overflow-hidden rounded-base border border-border">
        <ul className="divide-y divide-border">
          {visible.map((r) => (
            <ImporterRow
              key={r.slug}
              row={r}
              status={status[r.slug]}
              imageUrl={imageOf(r)}
              onAuto={() => runAuto(r.slug)}
              onManual={(url) => runManual(r.slug, url)}
              onUpload={(file) => runUpload(r.slug, file)}
            />
          ))}
          {visible.length === 0 && (
            <li className="p-6 text-center text-sm text-muted">
              Nessun prodotto da mostrare.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function ImporterRow({
  row,
  status,
  imageUrl,
  onAuto,
  onManual,
  onUpload,
}: {
  row: Row;
  status?: Status;
  imageUrl: string | null;
  onAuto: () => void;
  onManual: (url: string) => void;
  onUpload: (file: File) => void;
}) {
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const state = status?.state ?? "idle";
  const showManual = state === "error";

  return (
    <li className="flex flex-wrap items-center gap-3 p-3">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-[3px] border border-border bg-surface-2">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="grid size-full place-items-center text-[10px] text-muted">
            —
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{row.title}</p>
        <p className="num truncate text-xs text-muted">/{row.slug}</p>
        {status?.message && (
          <p
            className={cn(
              "mt-0.5 text-xs",
              state === "ok" ? "text-emerald-600" : "text-danger",
            )}
          >
            {status.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {state === "loading" && (
          <Loader2 className="size-4 animate-spin text-muted" aria-hidden />
        )}
        {state === "ok" && (
          <Check className="size-4 text-emerald-600" aria-hidden />
        )}
        {state === "error" && <X className="size-4 text-danger" aria-hidden />}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={state === "loading"}
          className="inline-flex items-center gap-1 rounded-base border border-border px-2 py-1.5 text-xs font-medium transition-colors hover:text-accent disabled:opacity-50"
        >
          <Upload className="size-3.5" aria-hidden />
          Carica file
        </button>
        <button
          type="button"
          onClick={onAuto}
          disabled={state === "loading"}
          className="inline-flex items-center gap-1 rounded-base border border-border px-2 py-1.5 text-xs font-medium transition-colors hover:text-accent disabled:opacity-50"
        >
          <RefreshCw className="size-3.5" aria-hidden />
          {imageUrl ? "Ri-scarica" : "Scarica"}
        </button>
      </div>

      {showManual && (
        <div className="flex w-full items-center gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Incolla un URL immagine (fallback)"
            className="h-8 flex-1 text-xs"
          />
          <button
            type="button"
            onClick={() => url.trim() && onManual(url.trim())}
            className="shrink-0 rounded-base border border-border px-2 py-1.5 text-xs font-medium transition-colors hover:text-accent"
          >
            Importa
          </button>
        </div>
      )}
    </li>
  );
}
