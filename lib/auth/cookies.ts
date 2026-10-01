import 'server-only'

import { cookies } from 'next/headers'


export const SESSION_COOKIE =
  '__Host-session'


export async function setSessionCookie(
  sessionId: string,
  expiresAt: Date,
): Promise<void> {
  const store = await cookies()

  store.set(
    SESSION_COOKIE,
    sessionId,
    {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    },
  )
}


export async function getSessionId():
  Promise<string | null> {
  const store = await cookies()

  return (
    store.get(SESSION_COOKIE)?.value ??
    null
  )
}


export async function clearSessionCookie():
  Promise<void> {
  const store = await cookies()

  store.delete(SESSION_COOKIE)
}