// GET api.aiohoush.com/gift?category='slug'

import { mockGiftVideo } from "@/mocks/gift-video";
import { ApiResponse } from "@/types/global";
import { VideoResponse } from "@/types/video";

export async function getGiftVideo(
  category: string,
): Promise<ApiResponse<VideoResponse>> {
  return mockGiftVideo;
}
