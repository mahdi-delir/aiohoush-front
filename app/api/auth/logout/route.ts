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

    /*
     * Logout را idempotent نگه می‌داریم.
     */
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

    /*
     * Cookie هست ولی Redis session نیست.
     * پس چیزی سمت BFF برای استفاده وجود ندارد.
     */
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

    /*
     * اول Django:
     * - refresh blacklist
     * - AuthSession revoked_at
     * - access فوراً invalid
     */
    await revokeDjangoSession(
      tokens.refresh,
    )

    /*
     * فقط بعد از موفقیت revoke سمت backend.
     */
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

    /*
     * اگر Django/Redis موقتاً unavailable باشد،
     * cookie را حذف نمی‌کنیم.
     *
     * چون حذف cookie بدون revoke سمت Django
     * باعث می‌شود session فعال ولی غیرقابل‌دسترسی
     * برای کاربر باقی بماند.
     */
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