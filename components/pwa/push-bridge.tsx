"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { unreadCountQueryKey } from "@/features/announcements/use-unread-count";
import { isPushSupported, registerServiceWorker, syncPush } from "@/features/push/push";

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
