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
  search = '',
): Promise<
  ApiResponse<CourseCatalogResponse>
> {
  const params = new URLSearchParams()

  if (category) {
    params.set('category', category)
  }

  if (search) {
    params.set('q', search)
  }

  const query = params.size
    ? `?${params.toString()}`
    : ''

  return apiFetch<CourseCatalogResponse>(
    `/api/courses/${query}`,
  )
}