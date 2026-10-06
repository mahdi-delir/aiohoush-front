import type { Metadata } from "next";
import { appleStartupImages } from "@/config/splash";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  manifest: "/app.webmanifest",
  appleWebApp: {
    capable: true,
    title: "آیوهوش",
    statusBarStyle: "black-translucent",
    startupImage: appleStartupImages,
  },
  icons: {
    apple: "/pwa/apple-icon-180.e73233ca.png",
  },
};

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}