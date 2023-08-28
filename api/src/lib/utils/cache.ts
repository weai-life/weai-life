import { logger } from '../logger'
import { get, setex } from './redis'

type FetchRedisCache = <T>(args: {
  key: string
  expiresIn: number
  fn: () => Promise<T>
}) => Promise<T>

export const fetchRedisCache: FetchRedisCache = async ({
  key,
  expiresIn,
  fn,
}) => {
  const value = await get(key)
  logger.debug('get cache for key (%s) get value: %o', key, value)

  if (value) return JSON.parse(value)

  logger.debug('get cache failed, call orignal function')
  return retrieveAgain()

  async function retrieveAgain() {
    const value = await fn()
    logger.debug('called orignal function get: %o', value)

    const data = JSON.stringify(value)

    // set cache
    await setex(key, expiresIn, data)

    return value
  }
}
