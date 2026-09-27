export const dashboardRoutes = {
    home : {
        title : "آیوهوش"
    },
    gift : {
        title : 'هدیه ها'
    },
    courses: {
        title: 'دوره های آموزشی'
    },
    wallet: {
        title: "کیف پول",
    },
} as const;

export type DashboardRoute = keyof typeof dashboardRoutes;