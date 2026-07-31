"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Move,
  Star,
  Trash2,
  Check,
  X,
} from "lucide-react";
import {
  deleteProductImage,
  moveProductImage,
  reorderProductImages,
  type ImageOpResult,
} from "@/features/admin/actions";

type Img = { url: string; alt: string };
type Prod = { slug: string; title: string; images: Img[] };

/**
 * Gestione rapida delle immagini prodotto: elimina, riordina (la prima è la
 * copertina) e sposta un'immagine su un altro prodotto. Ogni azione ricarica i
 * dati dal server.
 */
export function ImageManager({ products }: { products: Prod[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [showEmpty, setShowEmpty] = useState(false);

  function run(fn: () => Promise<ImageOpResult>) {
    startTransition(async () => {
      const r = await fn();
      setMsg(r.message);
      router.refresh();
    });
  }

  const query = q.trim().toLowerCase();
  const list = products
    .filter((p) => (showEmpty ? true : p.images.length > 0))
    .filter((p) => !query || p.title.toLowerCase().includes(query));

  const totalImages = products.reduce((n, p) => n + p.images.length, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca prodotto…"
          className="w-full max-w-xs rounded-base border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={showEmpty}
            onChange={(e) => setShowEmpty(e.target.checked)}
          />
          Mostra anche senza foto
        </label>
        <span className="text-sm text-muted">
          {totalImages} foto su {products.length} prodotti
        </span>
      </div>

      {msg && (
        <p className="rounded-base border border-border bg-surface-2 px-3 py-2 text-sm">
          {msg}
        </p>
      )}

      <div
        className={
          pending ? "pointer-events-none opacity-60 transition-opacity" : ""
        }
      >
        {list.length === 0 ? (
          <p className="text-sm text-muted">Nessun prodotto.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {list.map((p) => (
              <li
                key={p.slug}
                className="rounded-base border border-border bg-surface p-4"
              >
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                  <span className="text-xs text-muted">
                    {p.images.length} foto
                  </span>
                </div>
                {p.images.length === 0 ? (
                  <p className="text-xs text-muted">Nessuna immagine.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {p.images.map((img, i) => (
                      <ImageCard
                        key={img.url}
                        product={p}
                        img={img}
                        index={i}
                        total={p.images.length}
                        products={products}
                        run={run}
                      />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ImageCard({
  product,
  img,
  index,
  total,
  products,
  run,
}: {
  product: Prod;
  img: Img;
  index: number;
  total: number;
  products: Prod[];
  run: (fn: () => Promise<ImageOpResult>) => void;
}) {
  const [moving, setMoving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [target, setTarget] = useState("");

  function reorderTo(to: number) {
    const urls = product.images.map((x) => x.url);
    const [x] = urls.splice(index, 1);
    if (x === undefined) return;
    urls.splice(to, 0, x);
    run(() => reorderProductImages(product.slug, urls));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative aspect-square overflow-hidden rounded-base border border-border bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.url}
          alt={img.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {index === 0 && (
          <span className="absolute left-1 top-1 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Copertina
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-0.5">
        <button
          type="button"
          title="Rendi copertina"
          disabled={index === 0}
          onClick={() => reorderTo(0)}
          className="rounded-sm p-1 text-muted hover:text-accent disabled:opacity-30"
        >
          <Star className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          title="Sposta indietro"
          disabled={index === 0}
          onClick={() => reorderTo(index - 1)}
          className="rounded-sm p-1 text-muted hover:text-accent disabled:opacity-30"
        >
          <ArrowLeft className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          title="Sposta avanti"
          disabled={index === total - 1}
          onClick={() => reorderTo(index + 1)}
          className="rounded-sm p-1 text-muted hover:text-accent disabled:opacity-30"
        >
          <ArrowRight className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          title="Sposta su un altro prodotto"
          onClick={() => setMoving((v) => !v)}
          className="rounded-sm p-1 text-muted hover:text-accent"
        >
          <Move className="size-4" aria-hidden />
        </button>
        {confirmDel ? (
          <span className="flex items-center">
            <button
              type="button"
              title="Conferma eliminazione"
              onClick={() => run(() => deleteProductImage(product.slug, img.url))}
              className="rounded-sm p-1 text-danger hover:opacity-80"
            >
              <Check className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              title="Annulla"
              onClick={() => setConfirmDel(false)}
              className="rounded-sm p-1 text-muted hover:text-text"
            >
              <X className="size-4" aria-hidden />
            </button>
          </span>
        ) : (
          <button
            type="button"
            title="Elimina"
            onClick={() => setConfirmDel(true)}
            className="rounded-sm p-1 text-muted hover:text-danger"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {moving && (
        <div className="flex flex-col gap-1.5 rounded-base border border-border bg-surface-2 p-2">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="rounded-sm border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
          >
            <option value="">Sposta a…</option>
            {products
              .filter((p) => p.slug !== product.slug)
              .map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
          </select>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={!target}
              onClick={() => {
                run(() => moveProductImage(product.slug, target, img.url));
                setMoving(false);
                setTarget("");
              }}
              className="flex-1 rounded-sm bg-accent px-2 py-1 text-xs font-semibold text-white disabled:opacity-40"
            >
              Sposta
            </button>
            <button
              type="button"
              onClick={() => setMoving(false)}
              className="rounded-sm border border-border px-2 py-1 text-xs"
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
