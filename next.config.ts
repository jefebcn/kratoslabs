import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Le foto caricate dall'admin (server action) possono superare il default di
  // 1 MB: alziamo il limite del body delle Server Action.
  experimental: {
    serverActions: { bodySizeLimit: "15mb" },
  },
  images: {
    // L'ottimizzatore di Next è attivo: ridimensiona le immagini alla misura
    // realmente richiesta e le serve in AVIF/WebP. Era disattivato
    // (`unoptimized: true`) dai tempi del catalogo mock fatto di SVG; con le
    // foto reali su Supabase Storage quel bypass costava a ogni visitatore il
    // download delle immagini a piena risoluzione.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Foto prodotto e galleria caricate dall'admin.
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Alcuni asset statici serviti tramite next/image sono SVG (placeholder
    // prodotto, certificato di analisi, tile della galleria): senza questo
    // flag l'ottimizzatore li rifiuterebbe con un 400 e resterebbero rotti.
    // Gli SVG vengono serviti come allegato e con una CSP che disabilita gli
    // script, così un SVG malevolo caricato dall'admin non può eseguire nulla.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
