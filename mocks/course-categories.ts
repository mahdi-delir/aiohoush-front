import { CategoryResponse } from "@/types/category";
import { ApiResponse } from "@/types/api";

export const mockCourseCat: ApiResponse<CategoryResponse> = {
  success: true,
  message: "دریافت اطلاعات با موفقیت انجام شد.",
  detail: "این پیام اگر api موفق نبود می آید",
  called_by: "webapp",
  data: {
    categories: [
      {
        id: 2,
        title: "طراحی وب",
        icon: 'web',
        slug: 'web'
      },
      {
        id: 3,
        title: "برنامه نویسی",
        icon: 'code',
        slug: 'programming'
      },
      {
        id: 4,
        title: "هوش مصنوعی",
        icon: 'chatbot',
        slug: 'ai'
      },
      {
        id: 5,
        title: "مهارت های کاربردی",
        icon: 'drawing',
        slug: 'skills'
      },
    ],
  },
};
