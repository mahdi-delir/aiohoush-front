import {
  apiFetch,
} from './client'
import type {
  MeResponse,
} from '@/types/auth'

export interface ActiveSession {
  id: string
  ip_address: string | null

  browser_name: string
  browser_version: string

  os_name: string
  os_version: string

  device_type: string
  device_brand: string
  device_model: string

  created_at: string
  last_used_at: string | null

  is_current: boolean
}


export async function requestLoginOtp(
  mobile: string,
) {
  return apiFetch<undefined>(
    '/api/auth/login/request-otp/',
    {
      method: 'POST',

      body: JSON.stringify({
        mobile,
      }),
    },
  )
}


export async function verifyLoginOtp(
  mobile: string,
  code: string,
) {
  return apiFetch<undefined>(
    '/api/auth/login/verify-otp/',
    {
      method: 'POST',

      body: JSON.stringify({
        mobile,
        code,
      }),
    },
  )
}


export async function logout() {
  return apiFetch<undefined>(
    '/api/auth/logout/',
    {
      method: 'POST',
    },
  )
}


export async function logoutAll() {
  return apiFetch<undefined>(
    '/api/auth/logout-all/',
    {
      method: 'POST',
    },
  )
}


export async function getActiveSessions() {
  return apiFetch<ActiveSession[]>(
    '/api/auth/sessions/',
    {
      method: 'GET',
    },
  )
}


export async function revokeSession(
  sessionId: string,
) {
  return apiFetch<undefined>(
    `/api/auth/sessions/${
      encodeURIComponent(sessionId)
    }/revoke/`,
    {
      method: 'POST',
    },
  )
}

export async function getMe() {
  return apiFetch<MeResponse>(
    '/api/auth/me/',
    {
      method: 'GET',
    },
  )
}