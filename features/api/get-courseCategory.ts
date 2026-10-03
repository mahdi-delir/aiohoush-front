import {
  apiFetch,
} from '@/lib/api/client'

import type {
  ApiResponse,
} from '@/types/api'

import type {
  CategoryResponse,
} from '@/types/category'


export function getCourseCat():
  Promise<
    ApiResponse<CategoryResponse>
  > {
  return apiFetch<CategoryResponse>(
    '/api/course-categories/',
  )
}