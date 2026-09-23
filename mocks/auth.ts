import type { MeResponse } from "@/types/auth";
import { ApiResponse } from "@/types/global";

export const mockMe: ApiResponse<MeResponse> = {
  success: true,

  message: "دریافت اطلاعات از سرور با موفقیت انجام شد",

  detaile:
    "این پیام در حالت هایی خواهد آمد که ارور داده و ارور دارای توضیحات است.",

  called_by: "webapp",

  data: {
    user: {
      id: 1,
      first_name: "مهدی",
      last_name: "دلیر",
    },

    groups: ["Teacher", "Employee", "CEO", "Student"],

    permissions: [
      "course.view",
      "course.add",
      "student.view",
      "gift.view",
      "ai.view",
      "project.view",
      "wallet.view",
      "guide.view",
      "mymentor.view",
      "bestmentor.view",
    ],

    user_data: {
      watched_gift: false,
      has_course: false,
      active_courses: [
        {
          id: 1,
          title: "پایتون مقدماتی",
          all_sessions: 20,
          current_session: 7,
          compleated_percent: 35,
        },
        {
          id: 2,
          title: "طراحی سایت با وردپرس",
          all_sessions: 8,
          current_session: 7,
          compleated_percent: 87.5,
        },
      ],
    },
  },
};
