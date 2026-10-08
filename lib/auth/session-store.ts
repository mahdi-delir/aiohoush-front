import 'server-only'

import {
  createHash,
  randomBytes,
} from 'node:crypto'

import { getRedis } from '@/lib/redis'

import {
  decryptTokenPair,
  encryptTokenPair,
  type TokenPair,
} from './refresh-cache'


function fingerprintSessionId(
  sessionId: string,
): string {
  return createHash('sha256')
    .update(sessionId)
    .digest('hex')
}


function getSessionKey(
  sessionId: string,
): string {
  return (
    'auth:bff:session:' +
    fingerprintSessionId(sessionId)
  )
}


export function getSessionLockKey(
  sessionId: string,
): string {
  return (
    'auth:bff:refresh-lock:' +
    fingerprintSessionId(sessionId)
  )
}


function getJwtExpirationMs(
  token: string,
): number {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid JWT')
  }

  const payload = JSON.parse(
    Buffer
      .from(parts[1], 'base64url')
      .toString('utf8'),
  ) as {
    exp?: number
  }

  if (typeof payload.exp !== 'number') {
    throw new Error(
      'JWT does not contain exp claim',
    )
  }

  return payload.exp * 1000
}


export async function createBffSession(
  tokens: TokenPair,
): Promise<{
  sessionId: string
  expiresAt: Date
}> {
  const sessionId = randomBytes(32)
    .toString('base64url')

  await saveBffSession(
    sessionId,
    tokens,
  )

  return {
    sessionId,
    expiresAt: new Date(
      getJwtExpirationMs(tokens.refresh),
    ),
  }
}


export async function saveBffSession(
  sessionId: string,
  tokens: TokenPair,
): Promise<Date> {
  const redis = await getRedis()

  const expiresAt =
    getJwtExpirationMs(tokens.refresh)

  const ttl =
    expiresAt - Date.now()

  if (ttl <= 0) {
    throw new Error(
      'Refresh token is already expired',
    )
  }

  await redis.set(
    getSessionKey(sessionId),
    encryptTokenPair(tokens),
    {
      PX: ttl,
    },
  )

  return new Date(expiresAt)
}


export async function loadBffSession(
  sessionId: string,
): Promise<TokenPair | null> {
  const redis = await getRedis()

  const encrypted = await redis.get(
    getSessionKey(sessionId),
  )

  if (!encrypted) {
    return null
  }

  return decryptTokenPair(encrypted)
}


export async function deleteBffSession(
  sessionId: string,
): Promise<void> {
  const redis = await getRedis()

  await redis.del(
    getSessionKey(sessionId),
  )
}