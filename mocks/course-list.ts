import { CategoriedCourse } from "@/types/course";
import { ApiResponse } from "@/types/global";

export const mockCourseList: ApiResponse<CategoriedCourse> = {
  success: true,
  message: "دریافت اطلاعات با موفقیت انجام شد.",
  called_by: "webapp",
  data: {
    fa_category: "طراحی وب",
    en_category: "web",
    slug: "web",
    courses: [
      {
        id: 1,
        title: "دوره کامل HTML",
        short_description: "کامل ترین دوره HTML",
        description: "این دوره بهترینه",
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
        duration: "20 ساعت و 49 دقیقه",
        episod_count: 21,
        season_count: 4,
        level: "mid",
        has_access: true,
        slug: "html-course",
        categories: [{ en: "web", fa: "طراحی وب" }],
        watched_percent: 13,
      },
    ],
  },
};
