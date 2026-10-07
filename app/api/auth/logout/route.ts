import {
  clearSessionCookie,
  getSessionId,
} from '@/lib/auth/cookies'

import {
  deleteBffSession,
  loadBffSession,
} from '@/lib/auth/session-store'

import {
  revokeDjangoSession,
} from '@/lib/auth/django-session'

import {
  assertTrustedOrigin,
  InvalidOriginError,
} from '@/lib/security/origin'


export const runtime = 'nodejs'


export async function POST(
  request: Request,
): Promise<Response> {
  try {
    assertTrustedOrigin(request)

    const sessionId =
      await getSessionId()

    if (!sessionId) {
      await clearSessionCookie()

      return Response.json(
        {
          success: true,
          message:
            'با موفقیت از حساب خارج شدید.',
          called_by: 'webapp',
        },
        {
          status: 200,
        },
      )
    }

    const tokens =
      await loadBffSession(sessionId)

    if (!tokens) {
      await clearSessionCookie()

      return Response.json(
        {
          success: true,
          message:
            'با موفقیت از حساب خارج شدید.',
          called_by: 'webapp',
        },
        {
          status: 200,
        },
      )
    }

    await revokeDjangoSession(
      tokens.refresh,
    )

    await deleteBffSession(
      sessionId,
    )

    await clearSessionCookie()

    return Response.json(
      {
        success: true,
        message:
          'با موفقیت از حساب خارج شدید.',
        called_by: 'webapp',
      },
      {
        status: 200,
      },
    )

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

    return Response.json(
      {
        success: false,
        message:
          'خروج از حساب انجام نشد. دوباره تلاش کنید.',
        called_by: 'webapp',
      },
      {
        status: 503,
      },
    )
  }
}