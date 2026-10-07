import 'server-only'

import { fetchDjango } from '@/lib/django'

import type {
  ApiResponse,
} from '@/types/api'

import type {
  MeResponse,
} from '@/types/auth'


export class CurrentUserServiceError
  extends Error {
  constructor() {
    super(
      'Current user service is unavailable',
    )

    this.name =
      'CurrentUserServiceError'
  }
}


export async function getCurrentUser():
  Promise<MeResponse | null> {

  let response: Response

  try {
  response = await fetchDjango(
        '/auth/me/',
        {
        method: 'GET',
        },
    )
    } catch (error) {
    console.error(
        'getCurrentUser -> fetchDjango failed:',
        error,
    )

    throw error
    }

  if (
    response.status === 401 ||
    response.status === 403
  ) {
    return null
  }

  let body:
    ApiResponse<MeResponse> | null = null

  try {
    body = (
      await response.json()
    ) as ApiResponse<MeResponse>
  } catch {
    throw new CurrentUserServiceError()
  }

  if (
    response.ok &&
    body.success === false
  ) {
    return null
  }

  if (!response.ok) {
    throw new CurrentUserServiceError()
  }

  if (
    !body.success ||
    !body.data
  ) {
    return null
  }

  return body.data
}