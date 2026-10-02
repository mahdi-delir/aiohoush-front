import {
  queryOptions,
} from '@tanstack/react-query'

import {
  getMe,
} from '@/lib/api/auth'


export const currentUserQueryKey = [
  'auth',
  'me',
] as const


export const currentUserQueryOptions =
  queryOptions({
    queryKey: currentUserQueryKey,

    queryFn: async () => {
      const response =
        await getMe()

      if (!response.data) {
        throw new Error(
          'Current user data is missing',
        )
      }

      return response.data
    },

    staleTime: 60_000,
  })