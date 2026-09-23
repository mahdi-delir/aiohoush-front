// GET api.aiohoush.com/gift?category='slug'

import { mockGiftVideo } from "@/mocks/gift-video";
import { ApiResponse } from "@/types/global";
import { VideoResponse } from "@/types/video";

export async function getVideo(
  slug?: string,
  id?: number
): Promise<ApiResponse<VideoResponse>> {
  return mockGiftVideo;
}
