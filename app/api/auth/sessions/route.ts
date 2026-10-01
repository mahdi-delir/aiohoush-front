import {
  forwardDjangoResponse,
} from '@/lib/django-public'

import {
  fetchDjango,
} from '@/lib/django'


export const runtime = 'nodejs'


export async function GET(): Promise<Response> {
  try {
    const response = await fetchDjango(
      '/auth/sessions/',
      {
        method: 'GET',
      },
    )

    return forwardDjangoResponse(response)

  } catch {
    return Response.json(
      {
        success: false,
        message:
          'دریافت نشست‌های فعال با خطا مواجه شد.',
        called_by: 'webapp',
      },
      {
        status: 503,
      },
    )
  }
}