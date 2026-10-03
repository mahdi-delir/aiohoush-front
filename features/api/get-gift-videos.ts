import { apiFetch } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { GiftVideosData } from "@/types/gift-video";

export async function getGiftVideos(): Promise<
  ApiResponse<GiftVideosData>
> {
  return apiFetch<GiftVideosData>(
    "/api/gift-videos/",
  );
}