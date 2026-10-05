"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import Image from "next/image";
import {
  dashboardRoutes,
  type DashboardRoute,
} from "@/config/dashboard-routes";
import Menu from "@/assets/puffy-icons/menu.svg";
import Bell from "@/assets/puffy-icons/bell.svg";
import Left from "@/assets/puffy-icons/left.svg";
import { useRouter } from "next/navigation";
import { Modal } from "../ui/modal";
import { useState } from "react";
import MenuItems from "./menu-item";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const segments = useSelectedLayoutSegments();
  const routeKey = segments.join("/");
  const router = useRouter();

  // مسیرهای پویا (مثلاً tickets/12) عنوان بخش اصلی را می‌گیرند.
  const currentRoute =
    dashboardRoutes[routeKey as DashboardRoute] ??
    dashboardRoutes[segments[0] as DashboardRoute] ??
    dashboardRoutes.home;

  const isHomeRoute = segments.length === 0;

  return (
    <header className="flex justify-between items-center">
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
        <Image src={Bell} alt="notification-icon" width={28} height={28} />
        {/* {isHomeRoute && (
          <Image src={Search} alt="search-icon" width={28} height={28} />
        )} */}
      </div>
      <Modal
        children={<MenuItems />}
        open={open}
        onClose={() => setOpen(false)}
        className="rounded-bl-none rounded-tl-none max-w-2/3 h-full bg-element-bg"
      />
    </header>
  );
}
