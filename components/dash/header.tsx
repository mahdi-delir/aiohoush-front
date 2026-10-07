"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import Image from "next/image";
import {
  dashboardRoutes,
  type DashboardRoute,
} from "@/config/dashboard-routes";
import Menu from "@/assets/puffy-icons/menu.svg";
import Left from "@/assets/puffy-icons/left.svg";
import { useRouter } from "next/navigation";
import { Modal } from "../ui/modal";
import { useState } from "react";
import MenuItems from "./menu-item";
import NotificationBell from "./notifications/notification-bell";

export default function DashboardHeader() {
  const pathname = usePathname();
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const open = openOnPath === pathname;
  const setOpen = (value: boolean) => setOpenOnPath(value ? pathname : null);
  const segments = useSelectedLayoutSegments();
  const routeKey = segments.join("/");
  const router = useRouter();

  const currentRoute =
    dashboardRoutes[routeKey as DashboardRoute] ??
    dashboardRoutes[segments[0] as DashboardRoute] ??
    dashboardRoutes.home;

  const isHomeRoute = segments.length === 0;

  return (
    <header className="flex justify-between items-center" style={{ viewTransitionName: "site-header" }}>
      <div className="flex items-center gap-4">
        <Image src="/logo.svg" width={28} height={28} alt="aiohoush-logo" />
        <span className="text-white">{currentRoute.title}</span>
      </div>
      <div className="flex flex-row-reverse justify-start gap-4">
        {isHomeRoute && (
          <Image
            src={Menu}
            alt="menu-icon"
            width={28}
            height={28}
            className="text-white"
            onClick={() => setOpen(true)}
          />
        )}

        {!isHomeRoute && (
          <Image
            src={Left}
            alt="back-icon"
            width={28}
            height={28}
            onClick={() => router.back()}
            aria-label="بازگشت"
            className="hover:cursor-pointer"
          />
        )}
        <NotificationBell />
      </div>
      <Modal
        children={<MenuItems onNavigate={() => setOpen(false)} />}
        open={open}
        onClose={() => setOpen(false)}
        className="rounded-bl-none rounded-tl-none max-w-2/3 h-full bg-element-bg"
      />
    </header>
  );
}
