import {
  fetchDjango,
} from '@/lib/django'

import {
  forwardDjangoResponse,
} from '@/lib/django-public'

import {
  invalidIdResponse,
} from '@/lib/bff'


export const runtime = 'nodejs'


export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  },
) {
  const { id } =
    await context.params

  if (!/^\d+$/.test(id)) return invalidIdResponse()

  const response =
    await fetchDjango(
      `/order/manage/orders/${id}/`,
      {
        method: 'GET',
      },
    )

  return forwardDjangoResponse(
    response,
  )
}