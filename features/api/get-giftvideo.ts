// GET api.aiohoush.com/gift?category='slug'

import { mockGiftVideo } from "@/mocks/gift-video";
import { GiftVideoResponse } from "@/types/video";

export async function getGiftVideo(
  category: string,
): Promise<GiftVideoResponse> {
  return mockGiftVideo;
}
