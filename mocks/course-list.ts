import { CourseListResponse } from "@/types/course-list";
import { ApiResponse } from "@/types/global";

export const mockCourseList: ApiResponse<CourseListResponse> = {
  success: true,
  message: "دریافت اطلاعات با موفقیت انجام شد.",
  called_by: "webapp",
  data: {
    category: "طراحی وب",
    slug: "web",
    courses: [
      {
        id: 1,
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
        duration: "20:02:00",
        has_access: true,
        level: "mid",
        title: "دوره کامل HTML",
        category: "طراحی وب",
        slug: "html-course",
        wathced_percent: 13,
      },
      {
        id: 2,
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3dCiwROrLu0dM5LLR23dRz2dPWBfu6ijBIM_Y2ai2dw&s=10",
        duration: "20:02:00",
        has_access: false,
        level: "mid",
        title: "دوره کامل CSS",
        category: "طراحی وب",
        slug: "css-course",
      },
    ],
  },
};
