import 'server-only'

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'node:crypto'


export interface TokenPair {
  access: string
  refresh: string
}


function getEncryptionKey(): Buffer {
  const raw = process.env.AUTH_REFRESH_CACHE_KEY

  if (!raw) {
    throw new Error('AUTH_REFRESH_CACHE_KEY is not configured')
  }

  const key = Buffer.from(raw, 'base64')

  if (key.length !== 32) {
    throw new Error(
      'AUTH_REFRESH_CACHE_KEY must decode to exactly 32 bytes'
    )
  }

  return key
}


export function encryptTokenPair(
  tokens: TokenPair,
): string {
  const key = getEncryptionKey()
  const iv = randomBytes(12)

  const cipher = createCipheriv(
    'aes-256-gcm',
    key,
    iv,
  )

  const plaintext = Buffer.from(
    JSON.stringify(tokens),
    'utf8',
  )

  const encrypted = Buffer.concat([
    cipher.update(plaintext),
    cipher.final(),
  ])

  const tag = cipher.getAuthTag()

  return Buffer.concat([
    iv,
    tag,
    encrypted,
  ]).toString('base64url')
}


export function decryptTokenPair(
  value: string,
): TokenPair {
  const raw = Buffer.from(
    value,
    'base64url',
  )

  const iv = raw.subarray(0, 12)
  const tag = raw.subarray(12, 28)
  const encrypted = raw.subarray(28)

  const decipher = createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    iv,
  )

  decipher.setAuthTag(tag)

  const plaintext = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ])

  return JSON.parse(
    plaintext.toString('utf8')
  ) as TokenPair
}