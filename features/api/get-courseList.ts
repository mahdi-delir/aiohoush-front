import { mockCourseList } from "@/mocks/course-list";
import { CourseListResponse } from "@/types/course-list";
import { ApiResponse } from "@/types/global";

export async function getCourseList(category: string): Promise<ApiResponse<CourseListResponse>> {
    return mockCourseList    
}