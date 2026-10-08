import {
  ApiClientError,
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
  return apiFetch<{ expires_in?: number }>(
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


export interface DeviceLimit {
  code: 'device_limit'
  ticket: string
  max_devices: number
  sessions: ActiveSession[]
}


export function getDeviceLimit(
  error: unknown,
): DeviceLimit | null {
  if (!(error instanceof ApiClientError)) {
    return null
  }

  const data = error.response?.data as
    | Partial<DeviceLimit>
    | undefined

  return data?.code === 'device_limit' &&
    typeof data.ticket === 'string' &&
    Array.isArray(data.sessions)
    ? (data as DeviceLimit)
    : null
}


export async function revokeLoginDevice(
  ticket: string,
  sessionId: string,
) {
  return apiFetch<undefined>(
    '/api/auth/login/devices/revoke/',
    {
      method: 'POST',

      body: JSON.stringify({
        ticket,
        session_id: sessionId,
      }),
    },
  )
}


export async function revokeAllLoginDevices(
  ticket: string,
) {
  return apiFetch<undefined>(
    '/api/auth/login/devices/revoke-all/',
    {
      method: 'POST',

      body: JSON.stringify({
        ticket,
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