import { ApiResponse } from "@/types/global";
import type { ProjectGalleryData } from "@/types/project";

export const mockProjects: ApiResponse<ProjectGalleryData> = {
  success: true,
  message: "دریافت اطلاعات از سرور با موفقیت انجام شد.",
  called_by: "webapp",
  data: {
    students: [
      {
        id: 1,
        name: "سارا محمدی",
        bio: "دانشجوی طراحی وب؛ به ساخت رابط‌های ساده و کاربردی علاقه دارم و با هر پروژه، چیز تازه‌ای یاد می‌گیرم.",
      },
      {
        id: 2,
        name: "علی رضایی",
        bio: "در مسیر یادگیری برنامه‌نویسی هستم. به حل مسئله و تبدیل ایده‌های کوچک به ابزارهای قابل استفاده علاقه دارم.",
      },
    ],
    projects: [
      {
        id: 1,
        title: "فضای کار؛ مدیریت کارهای روزانه",
        description:
          "یک فضای ساده برای مرتب‌کردن کارها، تعیین اولویت و دنبال‌کردن مسیر انجام هر فعالیت. تمرینی برای ساخت رابط‌های کاربردی و منظم.",
        category: "aiohoush",
        studentId: null,
        artwork: "workspace",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
        githubUrl: null,
        files: [
          {
            id: "workspace-guide",
            name: "workspace-demo.zip",
            url: "/projects-demo/workspace-demo.zip",
            sizeLabel: "فایل نمونه",
          },
        ],
      },
      {
        id: 2,
        title: "نمای داده؛ داشبورد آماری",
        description:
          "نمایش خلاصهٔ اطلاعات و روندها در یک داشبورد جمع‌وجور؛ با تمرکز بر خوانایی اعداد و چیدمان بخش‌های مختلف صفحه.",
        category: "aiohoush",
        studentId: null,
        artwork: "analytics",
        technologies: ["React", "TypeScript"],
        githubUrl: null,
        files: [
          {
            id: "analytics-guide",
            name: "analytics-demo.zip",
            url: "/projects-demo/analytics-demo.zip",
            sizeLabel: "فایل نمونه",
          },
        ],
      },
      {
        id: 3,
        title: "وب‌سایت شخصی و نمونه‌کار",
        description:
          "طراحی یک وب‌سایت شخصی برای معرفی مهارت‌ها و نمایش نمونه‌کارها؛ با ساختاری سبک و متناسب با صفحه‌نمایش موبایل.",
        category: "students",
        studentId: 1,
        artwork: "portfolio",
        technologies: ["HTML", "CSS", "JavaScript"],
        githubUrl: null,
        files: [
          {
            id: "portfolio-guide",
            name: "portfolio-demo.zip",
            url: "/projects-demo/portfolio-demo.zip",
            sizeLabel: "فایل نمونه",
          },
        ],
      },
      {
        id: 4,
        title: "هم‌درس؛ برنامه‌ریز مطالعه",
        description:
          "یک ایدهٔ دانشجویی برای تقسیم هدف‌های بزرگ به قدم‌های کوچک؛ برنامه‌ریزی درس‌ها و مشاهدهٔ پیشرفت مطالعه در طول هفته.",
        category: "students",
        studentId: 2,
        artwork: "learning",
        technologies: ["React", "CSS"],
        githubUrl: null,
        files: [
          {
            id: "learning-guide",
            name: "learning-demo.zip",
            url: "/projects-demo/learning-demo.zip",
            sizeLabel: "فایل نمونه",
          },
        ],
      },
    ],
  },
};
