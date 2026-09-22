export const dashboardRoutes = {
    home : {
        title : "آیوهوش"
    },
    gift : {
        title : 'هدیه ها'
    }
} as const;

export type DashboardRoute = keyof typeof dashboardRoutes;