'use client'

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  useRouter,
} from 'next/navigation'

import {
  logout,
} from '@/lib/api/auth'

import {
  currentUserQueryKey,
} from '@/features/auth/queries/current-user'


export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: currentUserQueryKey,
      })

      router.replace('/login')
      router.refresh()
    },
  })
}