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

import {
  disablePush,
} from '@/features/push/push'


export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    // نوتیفیکیشن این دستگاه قبل از خروج قطع شود تا اعلان‌های این حساب
    // به کاربر بعدی همین گوشی نرسد.
    mutationFn: async () => {
      await disablePush().catch(() => undefined)
      return logout()
    },

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: currentUserQueryKey,
      })

      router.replace('/login')
      router.refresh()
    },
  })
}