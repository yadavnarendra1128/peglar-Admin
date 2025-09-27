import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // disables TS errors at build time
  },
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint errors at build time
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",   // anything starting with /api
        destination: "http://31.97.61.201/api/:path*", // backend target
      },
    ];
  },
};

export default nextConfig;
