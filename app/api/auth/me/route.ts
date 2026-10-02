import {
  fetchDjango,
} from '@/lib/django'

import {
  forwardDjangoResponse,
} from '@/lib/django-public'


export const runtime = 'nodejs'


export async function GET(): Promise<Response> {
  try {
    const response =
      await fetchDjango(
        '/auth/me/',
        {
          method: 'GET',
        },
      )

    return forwardDjangoResponse(
      response,
    )
  } catch {
    return Response.json(
      {
        success: false,
        message:
          'دریافت اطلاعات کاربر با خطا مواجه شد.',
        called_by: 'webapp',
      },
      {
        status: 503,
      },
    )
  }
}