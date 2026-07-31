import Image from "next/image";
import type { GalleryImage } from "@/features/gallery/queries";

/** "Galleria Touchdown": foto reali dei clienti, in una fascia orizzontale. */
export function CommunityGallery({ items }: { items: GalleryImage[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {items.map((item) => (
        <figure
          key={item.id}
          className="overflow-hidden rounded-base border border-border bg-surface"
        >
          <Image
            src={item.url}
            alt={item.alt}
            width={400}
            height={300}
            sizes="(max-width: 640px) 45vw, 22vw"
            className="h-28 w-auto object-contain sm:h-40 md:h-48"
          />
        </figure>
      ))}
    </div>
  );
}
