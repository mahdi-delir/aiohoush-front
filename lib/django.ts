import 'server-only'

import { cookies } from 'next/headers'

import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from '@/lib/auth/cookies'

import {
  RefreshRejectedError,
  refreshTokensSingleFlight,
} from '@/lib/auth/refresh'


interface DjangoFetchOptions
  extends RequestInit {
  retryOn401?: boolean
}


function buildHeaders(
  initialHeaders: HeadersInit | undefined,
  access: string | undefined,
): Headers {
  const headers = new Headers(
    initialHeaders,
  )

  if (access) {
    headers.set(
      'Authorization',
      `Bearer ${access}`,
    )
  }

  return headers
}


export async function fetchDjango(
  path: string,
  options: DjangoFetchOptions = {},
): Promise<Response> {
  const {
    retryOn401 = true,
    ...fetchOptions
  } = options

  const store = await cookies()

  const access =
    store.get(ACCESS_COOKIE)?.value

  const firstResponse = await fetch(
    `${process.env.DJANGO_API_URL}${path}`,
    {
      ...fetchOptions,

      headers: buildHeaders(
        fetchOptions.headers,
        access,
      ),

      cache: 'no-store',
    },
  )

  if (
    firstResponse.status !== 401 ||
    !retryOn401
  ) {
    return firstResponse
  }

  const refresh =
    store.get(REFRESH_COOKIE)?.value

  if (!refresh) {
    return firstResponse
  }

  try {
    const tokens =
      await refreshTokensSingleFlight(
        refresh,
      )

    await setAuthCookies(tokens)

    return await fetch(
      `${process.env.DJANGO_API_URL}${path}`,
      {
        ...fetchOptions,

        headers: buildHeaders(
          fetchOptions.headers,
          tokens.access,
        ),

        cache: 'no-store',
      },
    )

  } catch (error) {
    /*
     * اگر خود Django refresh را رد کرده باشد،
     * session دیگر usable نیست.
     *
     * خطای Redis/network را با invalid token
     * یکی نمی‌کنیم.
     */
    if (
      error instanceof RefreshRejectedError &&
      error.status >= 400 &&
      error.status < 500
    ) {
      await clearAuthCookies()
    }

    throw error
  }
}