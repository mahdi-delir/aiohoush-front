import { Course } from "@/types/course";
import { ApiResponse } from "@/types/api";

export const mockCourse: ApiResponse<Course> = {
  success: true,
  called_by: "webapp",
  message: "دریافت اطلاعات با موفقیت انجام شد.",
  data: {
    course: {
      id: 1,
      title: "دوره کامل HTML",
      short_description:
        "در این دوره HTML بصورت کامل در 20 جلسه تدریس شده است.",
      description:
        "این دوره بهترین دوره ای هست که شما میتونید برای آموزش HTML انتخاب کنید. در این دوره ما سعی کردیم همه مطالب در باره این موضوع رو پوشش بدیم و همه تگ ها کامل پوشش داده شده اند. مدرس طول جلسات این دوره رو حدود یک ساعت در نظر گرفته است که انی خیلی خوب ایت. و این توضیحات بصورت تستی نوشته میشن تا تست بشن.",
      cover:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
      duration: "20 ساعت و 23 دقیقه",
      episod_count: 21,
      season_count: 4,
      level: "mid",
      has_access: true,
      slug: "html-course",
    },
    seasons: [
      {
        title: "فصل اول",
        subject: "آشنایی و مقدمات",
        duration: "4 ساعت و 30 دقیقه",
        episod_count: 4,
        episods: [
          {
            id: 1,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه اول دوره html",
            order: 1,
            short_desc: "معرفی دوره و مسیر یادگیری",
            description:
              "در این جلسه تمامی موارد مرتبط با HTML توضیح داده شده است.",
            has_source_code: true,
            source_code_url: 'https://api.aiohosh.com/public/media/html-course/01/source.zip',
            has_homework: true,
            is_public: true,
            duration: "49 دقیقه",
            wathced_percent: 100,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
          {
            id: 2,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه دوم دوره html",
            order: 2,
            short_desc: "نصب نرم‌افزار و پیش‌نیاز ها",
            description: "نصب نرم‌افزار و پیش‌نیاز های دوره",
            has_source_code: true,
            has_homework: true,
            is_public: true,
            duration: "30 دقیقه",
            wathced_percent: 80,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
          {
            id: 3,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه سوم دوره html",
            order: 3,
            short_desc: "معرفی دوره و مسیر یادگیری",
            description:
              "در این جلسه تمامی موارد مرتبط با HTML توضیح داده شده است.",
            has_source_code: true,
            has_homework: true,
            is_public: false,
            duration: "49 دقیقه",
            wathced_percent: 100,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
        ],
      },
      {
        title: "فصل دوم",
        subject: "المان های ابتدائی",
        duration: "5 ساعت و 30 دقیقه",
        episod_count: 4,
        episods: [
          {
            id: 5,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه اول دوره html",
            order: 5,
            short_desc: "معرفی دوره و مسیر یادگیری",
            description:
              "در این جلسه تمامی موارد مرتبط با HTML توضیح داده شده است.",
            has_source_code: true,
            has_homework: true,
            is_public: true,
            duration: "49 دقیقه",
            wathced_percent: 100,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
          {
            id: 6,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه دوم دوره html",
            order: 6,
            short_desc: "نصب نرم‌افزار و پیش‌نیاز ها",
            description: "نصب نرم‌افزار و پیش‌نیاز های دوره",
            has_source_code: true,
            has_homework: true,
            is_public: true,
            duration: "30 دقیقه",
            wathced_percent: 80,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
          {
            id: 7,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه سوم دوره html",
            order: 7,
            short_desc: "معرفی دوره و مسیر یادگیری",
            description:
              "در این جلسه تمامی موارد مرتبط با HTML توضیح داده شده است.",
            has_source_code: true,
            has_homework: true,
            is_public: false,
            duration: "49 دقیقه",
            wathced_percent: 100,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
        ],
      },
      {
        title: "فصل سوم",
        subject: "آشنایی و مقدمات",
        duration: "4 ساعت و 30 دقیقه",
        episod_count: 4,
        episods: [
          {
            id: 8,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه اول دوره html",
            order: 8,
            short_desc: "معرفی دوره و مسیر یادگیری",
            description:
              "در این جلسه تمامی موارد مرتبط با HTML توضیح داده شده است.",
            has_source_code: true,
            has_homework: true,
            is_public: true,
            duration: "49 دقیقه",
            wathced_percent: 100,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
          {
            id: 9,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه دوم دوره html",
            order: 9,
            short_desc: "نصب نرم‌افزار و پیش‌نیاز ها",
            description: "نصب نرم‌افزار و پیش‌نیاز های دوره",
            has_source_code: true,
            has_homework: true,
            is_public: true,
            duration: "30 دقیقه",
            wathced_percent: 80,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
          {
            id: 10,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه سوم دوره html",
            order: 10,
            short_desc: "معرفی دوره و مسیر یادگیری",
            description:
              "در این جلسه تمامی موارد مرتبط با HTML توضیح داده شده است.",
            has_source_code: true,
            has_homework: true,
            is_public: false,
            duration: "49 دقیقه",
            wathced_percent: 100,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
        ],
      },
      {
        title: "فصل اول",
        subject: "آشنایی و مقدمات",
        duration: "4 ساعت و 30 دقیقه",
        episod_count: 4,
        episods: [
          {
            id: 1,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه اول دوره html",
            order: 1,
            short_desc: "معرفی دوره و مسیر یادگیری",
            description:
              "در این جلسه تمامی موارد مرتبط با HTML توضیح داده شده است.",
            has_source_code: true,
            has_homework: true,
            is_public: true,
            duration: "49 دقیقه",
            wathced_percent: 100,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
          {
            id: 2,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه دوم دوره html",
            order: 2,
            short_desc: "نصب نرم‌افزار و پیش‌نیاز ها",
            description: "نصب نرم‌افزار و پیش‌نیاز های دوره",
            has_source_code: true,
            has_homework: true,
            is_public: true,
            duration: "30 دقیقه",
            wathced_percent: 80,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
          {
            id: 3,
            playerUrl:
              "https://aiohoush.arvanvod.ir/y38N51NeG0/eA6adKolwk/h_,144_200,240_400,360_761,480_761,720_761,1080_761,k.mp4.list/master.m3u8",
            title: "جلسه سوم دوره html",
            order: 3,
            short_desc: "معرفی دوره و مسیر یادگیری",
            description:
              "در این جلسه تمامی موارد مرتبط با HTML توضیح داده شده است.",
            has_source_code: true,
            has_homework: true,
            is_public: false,
            duration: "49 دقیقه",
            wathced_percent: 100,
            cover:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuW4Z_DKjJnacOk7Up3MXi7GR8e5h7wfeuuNHpxwrUw&s=10",
          },
        ],
      },
    ],
  },
};
