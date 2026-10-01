'use client'

import { useMutation } from '@tanstack/react-query'

import {
  requestLoginOtp,
  verifyLoginOtp,
} from '@/lib/api/auth'


export function useRequestLoginOtp() {
  return useMutation({
    mutationFn: (mobile: string) =>
      requestLoginOtp(mobile),
  })
}


export function useVerifyLoginOtp() {
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
  })
}