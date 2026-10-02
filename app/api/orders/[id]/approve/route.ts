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


export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  },
) {
  assertTrustedOrigin(request)

  const { id } =
    await context.params

  const response =
    await fetchDjango(
      `/order/manage/orders/${id}/approve/`,
      {
        method: 'POST',
      },
    )

  return forwardDjangoResponse(
    response,
  )
}