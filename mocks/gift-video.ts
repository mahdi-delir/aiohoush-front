import { ApiResponse } from "@/types/api";
import type { VideoItem } from "@/types/video";

export const mockGiftVideo: ApiResponse<VideoItem> = {
  success: true,
  message: "دریافت اطلاعات با موفقیت انجام شد.",
  detail: "این پیام اگر api موفق نبود می آید",
  called_by: "webapp",
  data: {
    id: 1,
    title: "ورود به دنیای برنامه نویسی",
    slug: "programming-start",
    playerUrl:
      "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
    has_source_code: false,
    has_homework: false,
    is_public: true,
    duration: "45 دقیقه",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
    order: 1,
  },
};
