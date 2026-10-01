import 'server-only'

import {
  deleteBffSession,
  loadBffSession,
} from './session-store'

import {
  revokeDjangoSession,
} from './django-session'


export async function revokeBffSession(
  sessionId: string,
): Promise<void> {
  const tokens =
    await loadBffSession(sessionId)

  if (!tokens) {
    return
  }

  await revokeDjangoSession(
    tokens.refresh,
  )

  await deleteBffSession(
    sessionId,
  )
}