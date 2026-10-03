import {
  apiFetch,
} from '@/lib/api/client'

import type {
  ApiResponse,
} from '@/types/api'

import type {
  CourseInfo,
} from '@/types/course'


export interface CourseCatalogResponse {
  courses: CourseInfo[]
}


export function getCourseList(
  category: string,
): Promise<
  ApiResponse<CourseCatalogResponse>
> {
  const query = category
    ? `?category=${encodeURIComponent(
        category,
      )}`
    : ''

  return apiFetch<CourseCatalogResponse>(
    `/api/courses/${query}`,
  )
}