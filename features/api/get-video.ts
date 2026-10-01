// GET api.aiohoush.com/gift?category='slug'

import { mockGiftVideo } from "@/mocks/gift-video";
import { ApiResponse } from "@/types/api";
import { VideoItem } from "@/types/video";

export async function getVideo(
  slug?: string,
  id?: number,
  order?: number,
): Promise<ApiResponse<VideoItem>> {
  return mockGiftVideo;
}
