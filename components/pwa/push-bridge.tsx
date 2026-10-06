"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { unreadCountQueryKey } from "@/features/announcements/use-unread-count";
import { isPushSupported, registerServiceWorker, syncPush } from "@/features/push/push";

/**
 * داخل داشبورد: service worker را ثبت می‌کند، اشتراک push را با کاربر
 * فعلی هماهنگ نگه می‌دارد و با رسیدن اعلان (وقتی اپ باز است) نشان
 * زنگوله را تازه می‌کند.
 */
export default function PushBridge() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !isPushSupported()) return;

    void registerServiceWorker()
      .then(() => syncPush())
      .catch(() => undefined);

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "announcement") {
        void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
      }
    };

    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, [queryClient]);

  return null;
}
