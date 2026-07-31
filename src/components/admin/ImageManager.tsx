"use client";

import { useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Move,
  Star,
  Trash2,
  Check,
  X,
  ZoomIn,
} from "lucide-react";
import {
  deleteProductImage,
  deleteProductImages,
  moveProductImage,
  reorderProductImages,
  type ImageOpResult,
} from "@/features/admin/actions";
import { Lightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

type Img = { url: string; alt: string };
type Prod = { slug: string; title: string; images: Img[] };

const keyOf = (slug: string, url: string) => `${slug}::${url}`;
function splitKey(k: string): { slug: string; url: string } {
  const i = k.indexOf("::");
  return { slug: k.slice(0, i), url: k.slice(i + 2) };
}

/**
 * Gestione rapida delle immagini prodotto: elimina (singola o in blocco),
 * riordina (la prima è la copertina), sposta su un altro prodotto e ingrandisci.
 * Le modifiche aggiornano lo stato locale senza ricaricare la pagina.
 */
export function ImageManager({ products }: { products: Prod[] }) {
  const [items, setItems] = useState<Prod[]>(products);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [showEmpty, setShowEmpty] = useState(false);
  const [zoom, setZoom] = useState<{ images: Img[]; index: number } | null>(
    null,
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function run(fn: () => Promise<ImageOpResult>, onOk: () => void) {
    startTransition(async () => {
      const r = await fn();
      setMsg(r.message);
      if (r.ok) onOk();
    });
  }

  // --- mutazioni locali (nessun reload) ---
  function localDelete(slug: string, urls: string[]) {
    const set = new Set(urls);
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug
          ? { ...p, images: p.images.filter((i) => !set.has(i.url)) }
          : p,
      ),
    );
  }
  function localReorder(slug: string, urls: string[]) {
    setItems((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        const byUrl = new Map(p.images.map((i) => [i.url, i]));
        const next = urls
          .map((u) => byUrl.get(u))
          .filter((i): i is Img => Boolean(i));
        return { ...p, images: next };
      }),
    );
  }
  function localMove(fromSlug: string, toSlug: string, url: string) {
    setItems((prev) => {
      const img = prev
        .find((p) => p.slug === fromSlug)
        ?.images.find((i) => i.url === url);
      const toTitle = prev.find((p) => p.slug === toSlug)?.title ?? toSlug;
      return prev.map((p) => {
        if (p.slug === fromSlug)
          return { ...p, images: p.images.filter((i) => i.url !== url) };
        if (p.slug === toSlug && img)
          return { ...p, images: [...p.images, { url, alt: toTitle }] };
        return p;
      });
    });
  }

  function toggleSelect(slug: string, url: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      const k = keyOf(slug, url);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  }

  function deleteOne(slug: string, url: string) {
    run(
      () => deleteProductImage(slug, url),
      () => {
        localDelete(slug, [url]);
        setSelected((prev) => {
          const n = new Set(prev);
          n.delete(keyOf(slug, url));
          return n;
        });
      },
    );
  }

  function deleteSelected() {
    const targets = [...selected].map(splitKey);
    if (!targets.length) return;
    run(
      () => deleteProductImages(targets),
      () => {
        const bySlug = new Map<string, string[]>();
        for (const t of targets) {
          if (!bySlug.has(t.slug)) bySlug.set(t.slug, []);
          bySlug.get(t.slug)!.push(t.url);
        }
        for (const [slug, urls] of bySlug) localDelete(slug, urls);
        setSelected(new Set());
      },
    );
  }

  const query = q.trim().toLowerCase();
  const list = items
    .filter((p) => (showEmpty ? true : p.images.length > 0))
    .filter((p) => !query || p.title.toLowerCase().includes(query));

  const totalImages = items.reduce((n, p) => n + p.images.length, 0);

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
          {totalImages} foto su {items.length} prodotti
        </span>
      </div>

      {/* Barra azioni selezione multipla */}
      {selected.size > 0 && (
        <div className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-3 rounded-base border border-accent/40 bg-accent-soft px-4 py-2.5 shadow-sm">
          <span className="text-sm font-medium">
            {selected.size} selezionate
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="rounded-base border border-border bg-surface px-3 py-1.5 text-xs font-medium"
            >
              Deseleziona
            </button>
            <button
              type="button"
              onClick={deleteSelected}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-base bg-danger px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Elimina selezionati ({selected.size})
            </button>
          </div>
        </div>
      )}

      {msg && (
        <p className="rounded-base border border-border bg-surface-2 px-3 py-2 text-sm">
          {msg}
        </p>
      )}

      <div className={pending ? "opacity-70 transition-opacity" : ""}>
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
                        products={items}
                        selected={selected.has(keyOf(p.slug, img.url))}
                        onToggleSelect={() => toggleSelect(p.slug, img.url)}
                        onZoom={() => setZoom({ images: p.images, index: i })}
                        onDelete={() => deleteOne(p.slug, img.url)}
                        onReorder={(urls) =>
                          run(
                            () => reorderProductImages(p.slug, urls),
                            () => localReorder(p.slug, urls),
                          )
                        }
                        onMove={(toSlug) =>
                          run(
                            () => moveProductImage(p.slug, toSlug, img.url),
                            () => localMove(p.slug, toSlug, img.url),
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {zoom && (
        <Lightbox
          images={zoom.images}
          index={zoom.index}
          onIndex={(i) => setZoom((z) => (z ? { ...z, index: i } : z))}
          onClose={() => setZoom(null)}
        />
      )}
    </div>
  );
}

function ImageCard({
  product,
  img,
  index,
  total,
  products,
  selected,
  onToggleSelect,
  onZoom,
  onDelete,
  onReorder,
  onMove,
}: {
  product: Prod;
  img: Img;
  index: number;
  total: number;
  products: Prod[];
  selected: boolean;
  onToggleSelect: () => void;
  onZoom: () => void;
  onDelete: () => void;
  onReorder: (urls: string[]) => void;
  onMove: (toSlug: string) => void;
}) {
  const [moving, setMoving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [target, setTarget] = useState("");

  function reorderTo(to: number) {
    const urls = product.images.map((x) => x.url);
    const [x] = urls.splice(index, 1);
    if (x === undefined) return;
    urls.splice(to, 0, x);
    onReorder(urls);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "group relative aspect-square overflow-hidden rounded-base border bg-surface-2",
          selected ? "border-accent ring-2 ring-accent" : "border-border",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.url}
          alt={img.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {/* Area cliccabile per lo zoom (sotto i controlli). */}
        <button
          type="button"
          onClick={onZoom}
          aria-label="Ingrandisci"
          className="absolute inset-0 cursor-zoom-in"
        >
          <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/25 group-hover:opacity-100">
            <ZoomIn className="size-6" aria-hidden />
          </span>
        </button>
        {/* Checkbox di selezione. */}
        <label
          className="absolute left-1.5 top-1.5 z-10 flex cursor-pointer items-center"
          title="Seleziona"
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="size-4 cursor-pointer [accent-color:#dc2626]"
          />
        </label>
        {index === 0 && (
          <span className="absolute right-1 top-1 z-10 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
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
              onClick={() => {
                onDelete();
                setConfirmDel(false);
              }}
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
                onMove(target);
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
