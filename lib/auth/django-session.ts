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

  /*
   * 400 یعنی refresh دیگر معتبر نیست:
   * expired / blacklisted / session revoked.
   * از دید ما session قبلی دیگر usable نیست.
   */
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