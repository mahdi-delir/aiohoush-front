"use client";

import { useQuery } from "@tanstack/react-query";

export const unreadCountQueryKey = ["announcements", "unread-count"] as const;

async function fetchUnreadCount(): Promise<number> {
  const response = await fetch("/api/announcements/unread-count", {
    credentials: "same-origin",
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) return 0;
  return Number(body.data?.unreadCount) || 0;
}

export function useUnreadCount() {
  return useQuery({
    queryKey: unreadCountQueryKey,
    queryFn: fetchUnreadCount,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  });
}
