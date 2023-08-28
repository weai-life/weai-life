import { NotFoundError } from '../errors'
import { hash } from 'bcryptjs'
import util from 'util'
import { NODE_ENV } from './env'
import crypto from 'crypto'

export { compare } from 'bcryptjs'

export const isProd = NODE_ENV === 'production'
export const isTest = NODE_ENV === 'test'
export const isDev = NODE_ENV === 'development'

export const hashPassword = (password: string) => hash(password, 10)

export const throwError = (msg: string) => {
  throw new NotFoundError(msg)
}

export const throwNil =
  (msg: string) =>
  <T>(x: T | null) =>
    x ? x : throwError(msg)

export const rejectNil =
  (msg: string) =>
  <T>(x: T | null) =>
    x ? x : Promise.reject(new NotFoundError(msg))

type PromiseFunction = <T>(x: T) => Promise<T>
export const ensure =
  <T>(f: PromiseFunction) =>
  (x: T) =>
    f(x).then((_) => x)

export const trace =
  (tag: string) =>
  <T>(x: T) => {
    console.log(`[${tag}] ${util.inspect(x)}`)
    return x
  }

export const uniqBy = <T>(fn: (t: T) => unknown, list: T[]): T[] => {
  const set = new Set()
  const indexList: number[] = []
  for (let i = 0; i < list.length; i++) {
    const item = fn(list[i])
    if (!set.has(item)) {
      set.add(item)
      indexList.push(i)
    }
  }

  return indexList.map((i) => list[i])
}

export function getHash(n = 6) {
  return crypto
    .createHash('md5')
    .update(new Date().toISOString())
    .digest('hex')
    .slice(0, n)
}
