import {
  fetchDjango,
} from '@/lib/django'

import {
  forwardDjangoResponse,
} from '@/lib/django-public'

import {
  invalidIdResponse,
  rejectUntrustedOrigin,
} from '@/lib/bff'


export const runtime = 'nodejs'


export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  },
) {
  const rejected = rejectUntrustedOrigin(request)
  if (rejected) return rejected

  const { id } =
    await context.params

  if (!/^\d+$/.test(id)) return invalidIdResponse()

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