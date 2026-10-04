import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  manifest: "/app.webmanifest",
  appleWebApp: {
    capable: true,
    title: "آیوهوش",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/pwa-icon/180",
  },
};

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}