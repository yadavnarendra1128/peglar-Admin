import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // disables TS errors at build time
  },
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint errors at build time
  },
};

export default nextConfig;
