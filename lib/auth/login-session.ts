import 'server-only'

import {
  clearSessionCookie,
  getSessionId,
  setSessionCookie,
} from '@/lib/auth/cookies'

import {
  createBffSession,
  deleteBffSession,
} from '@/lib/auth/session-store'

import {
  revokeBffSession,
} from '@/lib/auth/session-lifecycle'

import {
  revokeDjangoSession,
} from '@/lib/auth/django-session'

import type {
  TokenPair,
} from '@/lib/auth/refresh-cache'

import {
  postDjangoJson,
} from '@/lib/django-public'

import {
  assertTrustedOrigin,
  InvalidOriginError,
} from '@/lib/security/origin'


interface ApiResponse<T> {
  success: boolean
  message: string
  detail?: unknown
  called_by?: string
  data?: T
}


async function completeLogin(
  djangoResponse: Response,
): Promise<Response> {
  let djangoBody: ApiResponse<TokenPair>

  try {
    djangoBody =
      await djangoResponse.json() as ApiResponse<TokenPair>
  } catch {
    return Response.json(
      {
        success: false,
        message:
          'پاسخ سرویس احراز هویت معتبر نبود.',
        called_by: 'webapp',
      },
      {
        status: 502,
      },
    )
  }

  if (
    !djangoResponse.ok ||
    !djangoBody.success
  ) {
    return Response.json(
      djangoBody,
      {
        status: djangoResponse.status,
      },
    )
  }

  const tokens = djangoBody.data

  if (
    !tokens?.access ||
    !tokens.refresh
  ) {
    return Response.json(
      {
        success: false,
        message:
          'پاسخ سرویس احراز هویت ناقص است.',
        called_by: 'webapp',
      },
      {
        status: 502,
      },
    )
  }

  const previousSessionId =
    await getSessionId()

  if (previousSessionId) {
    try {
      await revokeBffSession(
        previousSessionId,
      )
    } catch {
      try {
        await revokeDjangoSession(
          tokens.refresh,
        )
      } catch {}

      return Response.json(
        {
          success: false,
          message:
            'تعویض نشست کاربر با خطا مواجه شد.',
          called_by: 'webapp',
        },
        {
          status: 503,
        },
      )
    }
  }

  try {
    const session =
      await createBffSession(tokens)

    try {
      await setSessionCookie(
        session.sessionId,
        session.expiresAt,
      )
    } catch (error) {
      await deleteBffSession(
        session.sessionId,
      )

      try {
        await revokeDjangoSession(
          tokens.refresh,
        )
      } catch {}

      await clearSessionCookie()

      throw error
    }
  } catch {
    if (previousSessionId) {
      await clearSessionCookie()
    }

    return Response.json(
      {
        success: false,
        message:
          'ایجاد نشست کاربر با خطا مواجه شد.',
        called_by: 'webapp',
      },
      {
        status: 503,
      },
    )
  }

  const {
    data: _tokens,
    ...publicBody
  } = djangoBody

  return Response.json(
    publicBody,
    {
      status: 200,
    },
  )
}


export async function loginThroughDjango(
  request: Request,
  path: string,
  pickBody: (body: Record<string, unknown>) => Record<string, unknown>,
): Promise<Response> {
  try {
    assertTrustedOrigin(request)

    const requestBody: unknown =
      await request.json()

    const body =
      requestBody && typeof requestBody === 'object'
        ? pickBody(requestBody as Record<string, unknown>)
        : {}

    const djangoResponse =
      await postDjangoJson(
        path,
        body,
      )

    return await completeLogin(djangoResponse)

  } catch (error) {
    if (
      error instanceof
        InvalidOriginError
    ) {
      return Response.json(
        {
          success: false,
          message:
            'درخواست نامعتبر است.',
          called_by: 'webapp',
        },
        {
          status: 403,
        },
      )
    }

    if (error instanceof SyntaxError) {
      return Response.json(
        {
          success: false,
          message:
            'بدنه درخواست معتبر نیست.',
          called_by: 'webapp',
        },
        {
          status: 400,
        },
      )
    }

    return Response.json(
      {
        success: false,
        message:
          'سرویس احراز هویت در دسترس نیست.',
        called_by: 'webapp',
      },
      {
        status: 503,
      },
    )
  }
}
