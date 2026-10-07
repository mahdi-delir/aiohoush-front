import 'server-only'

import { randomUUID } from 'node:crypto'

import { getRedis } from '@/lib/redis'

import type { TokenPair } from './refresh-cache'

import {
  deleteBffSession,
  getSessionLockKey,
  loadBffSession,
  saveBffSession,
} from './session-store'


interface ApiResponse<T> {
  success: boolean
  message: string
  detail?: unknown
  data?: T
}


const RELEASE_LOCK_SCRIPT = `
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
`


function getNumberEnv(
  name: string,
): number {
  const raw = process.env[name]

  if (!raw) {
    throw new Error(
      `${name} is not configured`,
    )
  }

  const value = Number(raw)

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(
      `${name} must be positive`,
    )
  }

  return value
}


function sleep(
  ms: number,
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}


async function requestRefresh(
  refresh: string,
): Promise<TokenPair> {
  const response = await fetch(
    `${process.env.DJANGO_API_URL}/auth/token/refresh/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        refresh,
      }),

      cache: 'no-store',
    },
  )

  let body: ApiResponse<TokenPair>

  try {
    body =
      await response.json() as
        ApiResponse<TokenPair>
  } catch {
    throw new Error(
      'Invalid refresh response',
    )
  }

  if (
    !response.ok ||
    !body.success ||
    !body.data?.access ||
    !body.data?.refresh
  ) {
    throw new RefreshRejectedError(
      response.status,
    )
  }

  return body.data
}


export class RefreshRejectedError
  extends Error {
  constructor(
    public readonly status: number,
  ) {
    super('Token refresh rejected')
  }
}


export class AuthSessionMissingError
  extends Error {
  constructor() {
    super('BFF auth session not found')
  }
}


export async function
refreshSessionSingleFlight(
  sessionId: string,
  observedAccess: string,
): Promise<TokenPair> {

  const redis = await getRedis()

  const lockKey =
    getSessionLockKey(sessionId)

  const lockTtl = getNumberEnv(
    'AUTH_REFRESH_LOCK_TTL_MS',
  )

  const waitTimeout = getNumberEnv(
    'AUTH_REFRESH_WAIT_TIMEOUT_MS',
  )

  const pollInterval = getNumberEnv(
    'AUTH_REFRESH_POLL_INTERVAL_MS',
  )

  const deadline =
    Date.now() + waitTimeout

  while (Date.now() < deadline) {

    const current =
      await loadBffSession(sessionId)

    if (!current) {
      throw new AuthSessionMissingError()
    }

    if (
      current.access !== observedAccess
    ) {
      return current
    }

    const owner = randomUUID()

    const acquired = await redis.set(
      lockKey,
      owner,
      {
        NX: true,
        PX: lockTtl,
      },
    )

    if (acquired !== 'OK') {
      await sleep(pollInterval)
      continue
    }

    try {
      const lockedCurrent =
        await loadBffSession(sessionId)

      if (!lockedCurrent) {
        throw new AuthSessionMissingError()
      }

      if (
        lockedCurrent.access !==
        observedAccess
      ) {
        return lockedCurrent
      }

      try {
        const tokens =
          await requestRefresh(
            lockedCurrent.refresh,
          )

        await saveBffSession(
          sessionId,
          tokens,
        )

        return tokens

      } catch (error) {
        if (
          error instanceof
            RefreshRejectedError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          const latest =
            await loadBffSession(
              sessionId,
            )

          if (
            latest &&
            latest.access !==
              observedAccess
          ) {
            return latest
          }

          await deleteBffSession(
            sessionId,
          )
        }

        throw error
      }

    } finally {
      await redis.eval(
        RELEASE_LOCK_SCRIPT,
        {
          keys: [lockKey],
          arguments: [owner],
        },
      )
    }
  }

  throw new Error(
    'Timed out waiting for token refresh',
  )
}