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
  const incoming =
    request.nextUrl.searchParams

  const params =
    new URLSearchParams()

  const category =
    incoming.get('category')

  const search =
    incoming.get('q')?.trim()

  if (category) {
    params.set('category', category)
  }

  if (search) {
    params.set('q', search.slice(0, 100))
  }

  const query = params.size
    ? `?${params.toString()}`
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