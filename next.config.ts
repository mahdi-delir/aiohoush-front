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
