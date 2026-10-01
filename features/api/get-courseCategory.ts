import { mockCourseCat } from "@/mocks/course-categories";
import { CategoryResponse } from "@/types/category";
import { ApiResponse } from "@/types/api";

export async function getCourseCat(): Promise<ApiResponse<CategoryResponse>> {
    return mockCourseCat
}