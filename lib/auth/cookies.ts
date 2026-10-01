import 'server-only'

import { cookies } from 'next/headers'

import type { TokenPair } from './refresh-cache'


export const ACCESS_COOKIE =
  '__Host-access_token'

export const REFRESH_COOKIE =
  '__Host-refresh_token'


function getJwtExpiration(
  token: string,
): Date {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid JWT')
  }

  const payload = JSON.parse(
    Buffer
      .from(parts[1], 'base64url')
      .toString('utf8')
  ) as {
    exp?: number
  }

  if (
    typeof payload.exp !== 'number'
  ) {
    throw new Error(
      'JWT does not contain exp claim'
    )
  }

  return new Date(
    payload.exp * 1000
  )
}


export async function setAuthCookies(
  tokens: TokenPair,
): Promise<void> {
  const store = await cookies()

  store.set(
    ACCESS_COOKIE,
    tokens.access,
    {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      expires: getJwtExpiration(
        tokens.access,
      ),
    },
  )

  store.set(
    REFRESH_COOKIE,
    tokens.refresh,
    {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      expires: getJwtExpiration(
        tokens.refresh,
      ),
    },
  )
}


export async function clearAuthCookies():
  Promise<void> {
  const store = await cookies()

  store.delete(ACCESS_COOKIE)
  store.delete(REFRESH_COOKIE)
}