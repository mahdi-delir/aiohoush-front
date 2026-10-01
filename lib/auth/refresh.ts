import 'server-only'

import {
  createHash,
  randomUUID,
} from 'node:crypto'

import { getRedis } from '@/lib/redis'
import {
  decryptTokenPair,
  encryptTokenPair,
  type TokenPair,
} from './refresh-cache'


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


function getNumberEnv(name: string): number {
  const raw = process.env[name]

  if (!raw) {
    throw new Error(`${name} is not configured`)
  }

  const value = Number(raw)

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(`${name} must be positive`)
  }

  return value
}


function fingerprintRefreshToken(
  refresh: string,
): string {
  return createHash('sha256')
    .update(refresh)
    .digest('hex')
}


function sleep(ms: number): Promise<void> {
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

  const body =
    await response.json() as ApiResponse<TokenPair>

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


export class RefreshRejectedError extends Error {
  constructor(
    public readonly status: number,
  ) {
    super('Token refresh rejected')
  }
}


export async function refreshTokensSingleFlight(
  refresh: string,
): Promise<TokenPair> {
  const redis = await getRedis()

  const fingerprint =
    fingerprintRefreshToken(refresh)

  const lockKey =
    `auth:refresh:lock:${fingerprint}`

  const resultKey =
    `auth:refresh:result:${fingerprint}`

  const lockTtl = getNumberEnv(
    'AUTH_REFRESH_LOCK_TTL_MS',
  )

  const resultTtl = getNumberEnv(
    'AUTH_REFRESH_RESULT_TTL_MS',
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
    const cached =
      await redis.get(resultKey)

    if (cached) {
      return decryptTokenPair(cached)
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

    if (acquired === 'OK') {
      try {
        /*
         * بعد از گرفتن lock دوباره check می‌کنیم؛
         * ممکن است درست قبل از lock نتیجه ساخته شده باشد.
         */
        const existing =
          await redis.get(resultKey)

        if (existing) {
          return decryptTokenPair(existing)
        }

        const tokens =
          await requestRefresh(refresh)

        await redis.set(
          resultKey,
          encryptTokenPair(tokens),
          {
            PX: resultTtl,
          },
        )

        return tokens

      } finally {
        /*
         * DEL ساده خطرناک است:
         * ممکن است TTL تمام شده باشد و process دیگری
         * lock جدید گرفته باشد.
         *
         * فقط owner خودش اجازه حذف دارد.
         */
        await redis.eval(
          RELEASE_LOCK_SCRIPT,
          {
            keys: [lockKey],
            arguments: [owner],
          },
        )
      }
    }

    await sleep(pollInterval)
  }

  throw new Error(
    'Timed out waiting for token refresh'
  )
}