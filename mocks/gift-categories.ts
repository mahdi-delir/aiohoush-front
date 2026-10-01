import type { CategoryResponse } from "@/types/category";
import { ApiResponse } from "@/types/global";

export const mockGiftCat: ApiResponse<CategoryResponse> = {
  success: true,
  message: "دریافت اطلاعات با موفقیت انجام شد.",
  detail: "این پیام اگر api موفق نبود می آید",
  called_by: "webapp",
  data: {
    categories: [
      {
        id: 1,
        title: "شروع برنامه نویسی",
        icon: "start",
        slug: "programming-start",
      },
      {
        id: 2,
        title: "طراحی گوگل",
        icon: "google",
        slug: "google",
      },
      {
        id: 3,
        title: "رزومه شخصی",
        icon: "resume",
        slug: "resume",
      },
      {
        id: 4,
        title: "طراحی ماشین حساب",
        icon: "calc",
        slug: "calculator",
      },
      {
        id: 5,
        title: "قندخون با AI",
        icon: "diabetes",
        slug: "diabetes",
      },
    ],
  },
};
