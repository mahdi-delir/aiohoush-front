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




export const runtime = 'nodejs'


interface ApiResponse<T> {
  success: boolean
  message: string
  detail?: unknown
  called_by?: string
  data?: T
}


export async function POST(
  request: Request,
): Promise<Response> {
  try {
    assertTrustedOrigin(request)

    const requestBody: unknown =
      await request.json()

    const djangoResponse =
      await postDjangoJson(
        '/auth/login/verify-otp/',
        requestBody,
      )

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

    /*
     * اگر همین مرورگر قبلاً login بوده،
     * session قبلی Django + Redis را revoke می‌کنیم.
     */
    if (previousSessionId) {
      try {
        await revokeBffSession(
          previousSessionId,
        )
      } catch {
        /*
         * Django برای login جدید session ساخته،
         * پس اگر تعویض session قبلی شکست خورد،
         * session جدید را هم تا جای ممکن revoke می‌کنیم.
         */
        try {
          await revokeDjangoSession(
            tokens.refresh,
          )
        } catch {
          // هیچ tokenای را log نکن.
        }

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

    let sessionId: string

    try {
      const session =
        await createBffSession(tokens)

      sessionId = session.sessionId

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
        } catch {
          // token را log نکن.
        }

        await clearSessionCookie()

        throw error
      }
    } catch {
      /*
       * اگر session قبلی revoke شده باشد ولی
       * session جدید نتواند ایجاد شود، cookie
       * قدیمی را باقی نمی‌گذاریم.
       */
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

    /*
     * JWTها نباید به browser برگردند.
     */
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