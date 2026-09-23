export interface CourseListItem {
    id:number;
    cover: string;
    title: string;
    has_access: boolean;
    wathced_percent?: number;
    duration: string;
    level: string;
    category?: string;
    slug: string;
}


export interface CourseListResponse {
    category: string,
    slug: string,
    courses: CourseListItem[]
}