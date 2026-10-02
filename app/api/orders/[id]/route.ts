import {
  fetchDjango,
} from '@/lib/django'

import {
  forwardDjangoResponse,
} from '@/lib/django-public'


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