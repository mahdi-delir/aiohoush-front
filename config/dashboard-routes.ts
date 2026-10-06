export const dashboardRoutes = {
    "best-seller": {
        title: "بهترین منتورها",
    },
    "my-mentor": {
        title: "منتور من",
    },
    wallet: {
        title: "کیف پول",
    },
    home : {
        title : "آیوهوش"
    },
    gift : {
        title : 'هدیه ها'
    },
    courses: {
        title: 'دوره های آموزشی'
    },
    tickets: {
        title: 'پشتیبانی'
    },
    "tickets/new": {
        title: 'تیکت جدید'
    },
    projects: {
        title: 'پروژه‌ها'
    },
    "projects/mine": {
        title: 'پروژه‌های من'
    },
    "projects/new": {
        title: 'ثبت پروژه'
    }
} as const;

export type DashboardRoute = keyof typeof dashboardRoutes;