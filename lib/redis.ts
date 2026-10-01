import 'server-only'

import { createClient } from 'redis'


function createRedisClient() {
  return createClient({
    url: process.env.NEXT_REDIS_URL!,
  })
}


type RedisClient = ReturnType<typeof createRedisClient>


const globalForRedis = globalThis as unknown as {
  redisPromise?: Promise<RedisClient>
}


export function getRedis(): Promise<RedisClient> {
  if (!globalForRedis.redisPromise) {
    globalForRedis.redisPromise = (async () => {
      const client = createRedisClient()

      client.on('error', (error) => {
        console.error('Redis error:', error)
      })

      await client.connect()

      return client
    })()
  }

  return globalForRedis.redisPromise
}