import { mockCourse } from "@/mocks/course";
import { Course } from "@/types/course";
import { ApiResponse } from "@/types/api";

export async function getCourse(slug:string):Promise<ApiResponse<Course>> {
    return mockCourse    
}