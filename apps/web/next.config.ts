import type { NextConfig } from "next";
import { legacyRedirects } from "./src/config/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@shilan/ui", "@shilan/core", "@shilan/firebase"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return legacyRedirects.map(({ from, to }) => ({ source: from, destination: to, permanent: true }));
  },
};

export default nextConfig;
