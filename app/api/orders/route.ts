import {
  fetchDjango,
} from '@/lib/django'

import {
  forwardDjangoResponse,
} from '@/lib/django-public'

import {
  assertTrustedOrigin,
} from '@/lib/security/origin'


export const runtime = 'nodejs'


export async function GET() {
  const response =
    await fetchDjango(
      '/order/manage/orders/',
      {
        method: 'GET',
      },
    )

  return forwardDjangoResponse(
    response,
  )
}


export async function POST(
  request: Request,
) {
  assertTrustedOrigin(request)

  const body =
    await request.json()

  const response =
    await fetchDjango(
      '/order/manage/orders/',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
          'Accept':
            'application/json',
        },

        body: JSON.stringify(body),
      },
    )

  return forwardDjangoResponse(
    response,
  )
}