import { UserInputError } from '@redwoodjs/graphql-server'
import crypto from 'crypto'
import * as redis from './redis'

const redisInviteCodeKey = (code: string) => `invitecode:${code}`

const cacheTime = 24 * 60 * 60 * 3 // 3天内有效

type genInviteCodeOption = {
  for: 'channel' | 'group'
}
// 生成6位验证码
export async function genInviteCode(
  userId: number,
  id: number,
  option: genInviteCodeOption = { for: 'channel' }
) {
  let retries = 20
  let code: string, result: string | null

  do {
    code = crypto.randomBytes(3).toString('hex').toUpperCase()
    result = await redis.get(redisInviteCodeKey(code))
    if (result === null) break

    retries--
  } while (retries > 0)

  if (retries === 0) {
    throw new Error('当前请求太多请稍后重试')
  }

  const data = JSON.stringify([userId, id, option])
  await redis.setex(redisInviteCodeKey(code), cacheTime, data)

  return code
}

export async function isValid(code: string) {
  const result = await redis.get(redisInviteCodeKey(code.toUpperCase()))
  return result !== null
}

type getDataByInviteCodeResult = [
  userId: number,
  id: number,
  option: genInviteCodeOption
]
export async function getDataByInviteCode(
  code: string
): Promise<getDataByInviteCodeResult> {
  const data = await redis.get(redisInviteCodeKey(code.toUpperCase()))

  if (data === null) throw new UserInputError('无效邀请码：不存在或者已经过期')
  const [userId, id, option] = JSON.parse(data)

  return [
    userId,
    id,
    option || { for: 'channel' }, // 向下兼容 早版没有 option 属性
  ]
}
