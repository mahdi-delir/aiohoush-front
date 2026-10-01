import 'server-only'

import { getSessionId } from '@/lib/auth/cookies'

import {
  AuthSessionMissingError,
  RefreshRejectedError,
  refreshSessionSingleFlight,
} from '@/lib/auth/refresh'

import {
  loadBffSession,
} from '@/lib/auth/session-store'


interface DjangoFetchOptions
  extends RequestInit {
  retryOn401?: boolean
}


function buildHeaders(
  initialHeaders:
    HeadersInit | undefined,
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
  options:
    DjangoFetchOptions = {},
): Promise<Response> {

  const {
    retryOn401 = true,
    ...fetchOptions
  } = options

  const sessionId =
    await getSessionId()

  const authSession =
    sessionId
      ? await loadBffSession(sessionId)
      : null

  const firstResponse = await fetch(
    `${process.env.DJANGO_API_URL}${path}`,
    {
      ...fetchOptions,

      headers: buildHeaders(
        fetchOptions.headers,
        authSession?.access,
      ),

      cache: 'no-store',
    },
  )

  if (
    firstResponse.status !== 401 ||
    !retryOn401 ||
    !sessionId ||
    !authSession
  ) {
    return firstResponse
  }

  try {
    const tokens =
      await refreshSessionSingleFlight(
        sessionId,
        authSession.access,
      )

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
    if (
      error instanceof
        RefreshRejectedError ||
      error instanceof
        AuthSessionMissingError
    ) {
      /*
       * اینجا cookie را حذف نمی‌کنیم چون
       * fetchDjango ممکن است جایی اجرا شود
       * که mutation cookie مجاز نیست.
       *
       * Redis session یا حذف شده یا معتبر نیست.
       */
      return firstResponse
    }

    throw error
  }
}