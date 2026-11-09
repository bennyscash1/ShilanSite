import type { NextConfig } from "next";
import { legacyRedirects } from "./src/config/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@shilan/ui", "@shilan/core", "@shilan/firebase"],
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 stays the default. 90 is for the homepage background so the dark green gradient does not band.
    qualities: [75, 90],
    // Blog images uploaded through the admin panel (Vercel Blob, public store).
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    serverActions: {
      // Admin image uploads (4MB max, plus multipart overhead). Vercel's request limit is 4.5MB.
      bodySizeLimit: "4.4mb",
    },
  },
  async redirects() {
    return legacyRedirects.map(({ from, to }) => ({ source: from, destination: to, permanent: true }));
  },
};

export default nextConfig;
