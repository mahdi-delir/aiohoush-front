export const dashboardRoutes = {
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