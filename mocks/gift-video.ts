import { ApiResponse } from "@/types/global";
import type { VideoResponse } from "@/types/video";

export const mockGiftVideo: ApiResponse<VideoResponse> = {
  success: true,
  message: "دریافت اطلاعات با موفقیت انجام شد.",
  detailed_message: "این پیام اگر api موفق نبود می آید",
  data: {
    videos: [
      {
        id: 1,
        title: "ورود به دنیای برنامه نویسی",
        slug: "programming-start",
        playerUrl:
          "https://aiohoush.arvanvod.ir/y38N51NeG0/V7PAgRZ1oO/h_,480_1500,720_2500,k.mp4.list/master.m3u8",
        has_source_code: false,
        has_homework: false,

      },
    ],
  },
};
