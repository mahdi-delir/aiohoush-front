'use client'

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  requestLoginOtp,
  revokeAllLoginDevices,
  revokeLoginDevice,
  verifyLoginOtp,
} from '@/lib/api/auth'


export function useRequestLoginOtp() {
  return useMutation({
    mutationFn: (mobile: string) =>
      requestLoginOtp(mobile),
  })
}


export function useVerifyLoginOtp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      mobile,
      code,
    }: {
      mobile: string
      code: string
    }) =>
      verifyLoginOtp(
        mobile,
        code,
      ),

    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export function useFreeLoginDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      ticket,
      sessionId,
    }: {
      ticket: string
      sessionId: string | null
    }) =>
      sessionId
        ? revokeLoginDevice(
          ticket,
          sessionId,
        )
        : revokeAllLoginDevices(ticket),

    onSuccess: () => {
      queryClient.clear()
    },
  })
}
