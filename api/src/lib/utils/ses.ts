import { UserInputError } from '@redwoodjs/graphql-server'
import * as redis from './redis'
import { isProd } from './misc'
import { logger } from 'src/lib/logger'
import { sendVerificationCode } from './mailer'

export const TEST_CODE = '111111'
const redisSmsKey = (email: string) => `sms:verify:${email}`

export async function getVerifyCode(email: string) {
  return redis.get(redisSmsKey(email))
}

export async function isNotExpired(email: string) {
  const code = await getVerifyCode(email)
  return !!code
}

const redisVerifyCacheTime = 300

export async function sendSes(email: string) {
  const smsCode = genVerificationCode()

  logger.trace('will send smsCode %s to %s', smsCode, email)

  redis.setex(redisSmsKey(email), redisVerifyCacheTime, smsCode)

  await sendVerificationCode(email, smsCode)
}

// 生成6位验证码
function genVerificationCode() {
  if (!isProd) return TEST_CODE

  return Array(6)
    .fill(0)
    .map(() => nRand())
    .join('')
}

function nRand() {
  return Math.floor(Math.random() * 10)
}

export async function ensureValidSesCode(email: string, sesCode: string) {
  const code = await getVerifyCode(email)

  if (code !== sesCode) {
    throw new UserInputError('验证码不匹配', {
      messages: {
        smsCode: ['验证码不匹配'],
      },
    })
  }
}
