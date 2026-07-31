"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Save, Trash2, Upload, X } from "lucide-react";
import {
  addGalleryImages,
  deleteGalleryImage,
  reorderGallery,
  updateGalleryReview,
  type GalleryOpResult,
} from "@/features/gallery/actions";
import type { GalleryImage } from "@/features/gallery/queries";

/**
 * Gestione della Galleria Touchdown: carica foto manualmente, eliminale o
 * riordinale. Ogni azione ricarica i dati dal server.
 */
export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function run(fn: () => Promise<GalleryOpResult>) {
    startTransition(async () => {
      const r = await fn();
      setMsg(r.message);
      router.refresh();
    });
  }

  function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const r = await addGalleryImages(fd);
      setMsg(r.message);
      form.reset();
      router.refresh();
    });
  }

  function reorderTo(index: number, to: number) {
    const ids = images.map((i) => i.id);
    const [x] = ids.splice(index, 1);
    if (x === undefined) return;
    ids.splice(to, 0, x);
    run(() => reorderGallery(ids));
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        ref={formRef}
        onSubmit={onUpload}
        className="flex flex-col gap-3 rounded-base border border-border bg-surface p-4"
      >
        <label className="text-sm font-medium">Carica foto</label>
        <input
          type="file"
          name="files"
          accept="image/*"
          multiple
          required
          className="text-sm"
        />
        <textarea
          name="caption"
          rows={2}
          placeholder="Testo recensione (facoltativo)"
          className="resize-none rounded-base border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            name="author"
            placeholder="Nome (es. Barry)"
            className="flex-1 rounded-base border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            name="country"
            placeholder="Paese (es. New Zealand)"
            className="flex-1 rounded-base border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            name="date"
            placeholder="Data (es. 2023.12.18)"
            className="w-40 rounded-base border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <select
            name="rating"
            defaultValue="5"
            className="rounded-base border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} ★
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-fit items-center gap-1.5 rounded-base bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Upload className="size-4" aria-hidden />
          Aggiungi
        </button>
      </form>

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
        {images.length === 0 ? (
          <p className="text-sm text-muted">
            Nessuna foto nella galleria. Usa il bookmarklet qui sopra o carica
            un file.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {images.map((img, i) => (
              <GalleryCard
                key={img.id}
                img={img}
                index={i}
                total={images.length}
                onReorder={reorderTo}
                run={run}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryCard({
  img,
  index,
  total,
  onReorder,
  run,
}: {
  img: GalleryImage;
  index: number;
  total: number;
  onReorder: (index: number, to: number) => void;
  run: (fn: () => Promise<GalleryOpResult>) => void;
}) {
  const [confirmDel, setConfirmDel] = useState(false);
  const [caption, setCaption] = useState(img.caption);
  const [author, setAuthor] = useState(img.author);
  const [country, setCountry] = useState(img.country);
  const [date, setDate] = useState(img.date);
  const [rating, setRating] = useState(img.rating || 5);
  const [slugs, setSlugs] = useState(img.productSlugs.join(", "));

  const dirty =
    caption !== img.caption ||
    author !== img.author ||
    country !== img.country ||
    date !== img.date ||
    rating !== img.rating ||
    slugs !== img.productSlugs.join(", ");

  function save() {
    run(() =>
      updateGalleryReview(img.id, {
        caption,
        author,
        country,
        date,
        rating,
        productSlugs: slugs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative aspect-square overflow-hidden rounded-base border border-border bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.url}
          alt={img.alt}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex items-center justify-between gap-0.5">
        <button
          type="button"
          title="Sposta indietro"
          disabled={index === 0}
          onClick={() => onReorder(index, index - 1)}
          className="rounded-sm p-1 text-muted hover:text-accent disabled:opacity-30"
        >
          <ArrowLeft className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          title="Sposta avanti"
          disabled={index === total - 1}
          onClick={() => onReorder(index, index + 1)}
          className="rounded-sm p-1 text-muted hover:text-accent disabled:opacity-30"
        >
          <ArrowRight className="size-4" aria-hidden />
        </button>
        {confirmDel ? (
          <span className="flex items-center">
            <button
              type="button"
              title="Conferma eliminazione"
              onClick={() => run(() => deleteGalleryImage(img.id, img.url))}
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

      <div className="flex flex-col gap-1.5 rounded-sm border border-border bg-surface-2 p-2">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={2}
          placeholder="Testo recensione…"
          className="resize-none rounded-sm border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
        />
        <div className="flex gap-1.5">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nome"
            className="min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded-sm border border-border bg-surface px-1 py-1 text-xs outline-none focus:border-accent"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r}★
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1.5">
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Paese"
            className="min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Data"
            className="w-24 rounded-sm border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
          />
        </div>
        <input
          value={slugs}
          onChange={(e) => setSlugs(e.target.value)}
          placeholder="Slug prodotti (separati da virgola)"
          className="rounded-sm border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-accent"
        />
        <button
          type="button"
          disabled={!dirty}
          onClick={save}
          className="inline-flex items-center justify-center gap-1 rounded-sm bg-accent px-2 py-1 text-xs font-semibold text-white disabled:opacity-40"
        >
          <Save className="size-3.5" aria-hidden />
          Salva recensione
        </button>
      </div>
    </div>
  );
}
