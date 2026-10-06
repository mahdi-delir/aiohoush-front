import type { NextConfig } from "next";

/*
 * نسخهٔ هر build = BUILD_ID همان build. در کد مرورگر ثابت می‌شود و سرور
 * آن را از فایل .next/BUILD_ID می‌خواند (app/api/app-version)؛ اگر فرق
 * داشتند، اپ پیام «به‌روزرسانی» نشان می‌دهد (components/pwa/update-prompt.tsx).
 */
const appVersion = process.env.APP_VERSION || String(Date.now());

const nextConfig: NextConfig = {
  /* config options here */
  generateBuildId: async () => appVersion,
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
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
