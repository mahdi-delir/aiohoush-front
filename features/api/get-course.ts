import { apiFetch } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Course } from "@/types/course";

export async function getCourse(
  slug: string,
): Promise<ApiResponse<Course>> {
  return apiFetch<Course>(
    `/api/courses/${encodeURIComponent(slug)}`,
  );
}