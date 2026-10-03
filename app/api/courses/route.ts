import {
  NextRequest,
} from 'next/server'

import {
  fetchDjango,
} from '@/lib/django'

import {
  forwardDjangoResponse,
} from '@/lib/django-public'


export const runtime = 'nodejs'


export async function GET(
  request: NextRequest,
) {
  const category =
    request.nextUrl.searchParams.get(
      'category',
    )

  const query = category
    ? `?category=${encodeURIComponent(
        category,
      )}`
    : ''

  const response =
    await fetchDjango(
      `/course/catalog/${query}`,
      {
        method: 'GET',
      },
    )

  return forwardDjangoResponse(
    response,
  )
}