import Image from "next/image";
import { GALLERY_ITEMS } from "@/lib/constants";

/** "Galleria Touchdown": foto reali dei clienti, in una fascia orizzontale. */
export function CommunityGallery() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {GALLERY_ITEMS.map((item) => (
        <figure
          key={item.id}
          className="overflow-hidden rounded-base border border-border bg-surface"
        >
          <Image
            src={item.imageUrl}
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
