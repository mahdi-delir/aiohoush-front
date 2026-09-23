import { mockCourseCat } from "@/mocks/course-categories";
import { CategoryResponse } from "@/types/category";
import { ApiResponse } from "@/types/global";

export async function getCourseCat(): Promise<ApiResponse<CategoryResponse>> {
    return mockCourseCat
}