import 'server-only'

import {
  postDjangoJson,
} from '@/lib/django-public'


export async function revokeDjangoSession(
  refresh: string,
): Promise<void> {
  const response = await postDjangoJson(
    '/auth/logout/',
    {
      refresh,
    },
  )

  if (
    response.ok ||
    response.status === 400
  ) {
    return
  }

  throw new Error(
    `Django logout failed with status ${response.status}`,
  )
}