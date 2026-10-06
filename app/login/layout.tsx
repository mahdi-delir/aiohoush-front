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
    apple: "/pwa/apple-icon-180.png",
  },
};

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}