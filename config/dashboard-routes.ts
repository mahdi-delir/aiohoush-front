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
    }
} as const;

export type DashboardRoute = keyof typeof dashboardRoutes;