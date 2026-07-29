import Image from "next/image";
import { GALLERY_ITEMS } from "@/lib/constants";

/** "Dalla community": foto reali dei clienti. Masonry con CSS columns. */
export function CommunityGallery() {
  return (
    <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
      {GALLERY_ITEMS.map((item) => (
        <figure
          key={item.id}
          className="break-inside-avoid overflow-hidden rounded-base border border-border bg-surface"
        >
          <Image
            src={item.imageUrl}
            alt={item.alt}
            width={400}
            height={item.span === 2 ? 420 : 300}
            sizes="(max-width: 768px) 50vw, 33vw"
            className="h-auto w-full"
          />
          <figcaption className="flex items-center justify-between px-3 py-2 text-xs text-muted">
            <span className="font-medium text-text">{item.author}</span>
            <span>{item.location}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
