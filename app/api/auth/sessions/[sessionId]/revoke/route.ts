import {
  forwardDjangoResponse,
} from '@/lib/django-public'

import {
  fetchDjango,
} from '@/lib/django'

import {
  assertTrustedOrigin,
  InvalidOriginError,
} from '@/lib/security/origin'


export const runtime = 'nodejs'


export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      sessionId: string
    }>
  },
): Promise<Response> {
  try {
    assertTrustedOrigin(request)

    const {
      sessionId,
    } = await params

    if (!sessionId) {
      return Response.json(
        {
          success: false,
          message:
            'شناسه نشست معتبر نیست.',
          called_by: 'webapp',
        },
        {
          status: 400,
        },
      )
    }

    const response = await fetchDjango(
      `/auth/sessions/${
        encodeURIComponent(sessionId)
      }/revoke/`,
      {
        method: 'POST',
      },
    )

    return forwardDjangoResponse(response)

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
          'خاتمه نشست با خطا مواجه شد.',
        called_by: 'webapp',
      },
      {
        status: 503,
      },
    )
  }
}
