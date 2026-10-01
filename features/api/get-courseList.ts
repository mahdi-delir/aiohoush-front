import { mockCourseList } from "@/mocks/course-list";
import { CourseList } from "@/types/course";
import { ApiResponse } from "@/types/api";

export async function getCourseList(category: string): Promise<ApiResponse<CourseList>> {
    return mockCourseList    
}