import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep dev-server resolution inside this repository, even with parent lockfiles.
  turbopack: { root: process.cwd() },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "65mb", // Increase the limit t0 15MB
    },
  },
};

export default nextConfig;
