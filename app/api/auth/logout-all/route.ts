import {
  clearSessionCookie,
  getSessionId,
} from '@/lib/auth/cookies'

import {
  deleteBffSession,
} from '@/lib/auth/session-store'

import {
  fetchDjango,
} from '@/lib/django'

import {
  forwardDjangoResponse,
} from '@/lib/django-public'

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
      return Response.json(
        {
          success: true,
          message:
            'نشست فعالی وجود ندارد.',
          called_by: 'webapp',
        },
        {
          status: 200,
        },
      )
    }

    const response = await fetchDjango(
      '/auth/logout-all/',
      {
        method: 'POST',
      },
    )

    if (response) {
      await deleteBffSession(
        sessionId,
      )

      await clearSessionCookie()
    }

    return forwardDjangoResponse(
      response,
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
          'خروج از تمام دستگاه‌ها با خطا مواجه شد.',
        called_by: 'webapp',
      },
      {
        status: 503,
      },
    )
  }
}