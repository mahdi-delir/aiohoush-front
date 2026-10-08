import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 2,
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
  allowedDevOrigins: [
    "192.168.1.*",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.aiohoush.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
