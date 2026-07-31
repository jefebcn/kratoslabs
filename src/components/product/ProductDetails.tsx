/**
 * Scheda descrittiva estesa del prodotto (Product Overview, Key Features,
 * Benefits, ecc.). L'HTML è già sanificato lato server (solo tag di testo,
 * nessun attributo), quindi è sicuro renderizzarlo.
 */
export function ProductDetails({ html }: { html: string }) {
  return (
    <div
      className="max-w-prose text-pretty text-sm leading-relaxed text-muted [&_b]:font-semibold [&_b]:text-text [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:text-text [&_h3]:mb-1.5 [&_h3]:mt-5 [&_h3]:font-semibold [&_h3]:text-text [&_h4]:mt-4 [&_h4]:font-semibold [&_h4]:text-text [&_li]:mt-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-3 [&_strong]:font-semibold [&_strong]:text-text [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&>*:first-child]:mt-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
