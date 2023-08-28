import { UserInputError } from '@redwoodjs/graphql-server'
import * as redis from './redis'
import { isProd } from './misc'
import { logger } from 'src/lib/logger'
import { sendSms as sendSmsByAliyun } from './sms_aliyun'

export const TEST_CODE = '111111'
const redisSmsKey = (mobile: string) => `sms:verify:${mobile}`

export async function getVerifyCode(mobile: string) {
  return redis.get(redisSmsKey(mobile))
}

export async function isNotExpired(mobile: string) {
  const code = await getVerifyCode(mobile)
  return !!code
}

const redisVerifyCacheTime = 300

export async function sendSms(mobile: string) {
  const smsCode = genVerificationCode()

  logger.trace('will send smsCode %s to %s', smsCode, mobile)

  redis.setex(redisSmsKey(mobile), redisVerifyCacheTime, smsCode)

  if (isProd) await sendSmsByAliyun(mobile, smsCode)
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

export async function ensureValidSmsCode(mobile: string, smsCode: string) {
  const code = await getVerifyCode(mobile)

  if (code !== smsCode) {
    throw new UserInputError('验证码不匹配', {
      messages: {
        smsCode: ['验证码不匹配'],
      },
    })
  }
}
