import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    /*
     * تعداد worker های build. پیش‌فرض = تعداد هستهٔ سرور build (روی
     * رانفلر ۷۴)، که هرکدام یک پروسهٔ Node جدا است و build با کمبود
     * حافظه (OOMKilled) متوقف می‌شد.
     */
    cpus: 2,
  },
  // service worker نوتیفیکیشن (public/sw.js) — طبق راهنمای PWA در مستندات Next.js
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
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        
      },
    ],
  },
};

export default nextConfig;
