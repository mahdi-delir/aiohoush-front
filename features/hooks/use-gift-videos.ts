"use client";

import { useQuery } from "@tanstack/react-query";
import { getGiftVideos } from "@/features/api/get-gift-videos";

export function useGiftVideos() {
  return useQuery({
    queryKey: ["gift-videos"],
    queryFn: getGiftVideos,
    staleTime: 60 * 1000,
  });
}