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
    // Fase mock: le immagini prodotto sono SVG statici in /public. L'optimizer
    // di Next blocca gli SVG per default, quindi lo bypassiamo. Quando arrivano
    // foto reali su un CDN, rimuovere `unoptimized` e usare `remotePatterns`.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default withNextIntl(nextConfig);
