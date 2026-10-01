import {
  forwardDjangoResponse,
  postDjangoJson,
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

    const body: unknown =
      await request.json()

    const response =
      await postDjangoJson(
        '/auth/login/request-otp/',
        body,
      )

    return forwardDjangoResponse(
      response,
    )

  } catch (error) {
    if (error instanceof InvalidOriginError) {
      return Response.json(
        {
          success: false,
          message: 'درخواست نامعتبر است.',
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
          message: 'بدنه درخواست معتبر نیست.',
        },
        {
          status: 400,
        },
      )
    }

    throw error
  }
}