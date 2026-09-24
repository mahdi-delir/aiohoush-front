import { Course } from "@/types/course";
import { ApiResponse } from "@/types/global";

export const mockCourse: ApiResponse<Course> = {
  success: true,
  called_by: "webapp",
  message: "دریافت اطلاعات با موفقیت انجام شد.",
  data: {
    id: 1,
    title: "دوره کامل HTML",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
    description: "این دوره بهترین دوره هست",
    duration: "20 ساعت و 23 دقیقه",
    episod_count: 21,
    has_access: true,
    intro_video:
      "https://aiohoush.arvanvod.ir/y38N51NeG0/V7PAgRZ1oO/h_,480_1500,720_2500,k.mp4.list/master.m3u8",
    level: "mid",
    episods: [
      {
        id: 1,
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
        title: "جلسه اول دوره html",
        subject: "توضیحات ابتدایی در مورد HTML",
        duration: "49 دقیقه",
        wathced_percent: 0,
      },
      {
        id: 2,
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
        title: "جلسه اول دوره html",
        subject: "توضیحات ابتدایی در مورد HTML",
        duration: "49 دقیقه",
        wathced_percent: 20,
      },
      {
        id: 3,
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
        title: "جلسه اول دوره html",
        subject: "توضیحات ابتدایی در مورد HTML",
        duration: "49 دقیقه",
        wathced_percent: 0,
      },
    ],
  },
};
