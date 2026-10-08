import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import {
  getCourseList,
} from '../api/get-courseList'


export function useCourseList(
  category: string,
  search = '',
) {
  return useQuery({
    queryFn: () =>
      getCourseList(category, search),

    queryKey: [
      'courseList',
      category,
      search,
    ],

    placeholderData: keepPreviousData,
  })
}
