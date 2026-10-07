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
  disablePush,
} from '@/features/push/push'


export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await disablePush().catch(() => undefined)
      return logout()
    },

    onSuccess: async () => {
      queryClient.clear()

      router.replace('/login')
      router.refresh()
    },
  })
}