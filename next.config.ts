import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Fase mock: le immagini prodotto sono SVG statici in /public. L'optimizer
    // di Next blocca gli SVG per default, quindi lo bypassiamo. Quando arrivano
    // foto reali su un CDN, rimuovere `unoptimized` e usare `remotePatterns`.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
