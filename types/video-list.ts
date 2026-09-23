export interface CourseListItem {
    id:number;
    cover: string;
    title: string;
    has_access: boolean;
    wathced_percent?: number;
    duration: number;
    level: string;
}

export interface CourseListResponse {
    courses: CourseListItem[]
}