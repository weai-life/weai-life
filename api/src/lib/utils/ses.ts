import { UserInputError } from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'

import { resendInvitationLink, resendSESCode } from './mailer'
import { isProd } from './misc'
import * as redis from './redis'

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

export async function sendInvitationLink(
  email: string,
  redirectUrl: string,
  inviter: string
) {
  const sesCode = genVerificationCode()

  logger.trace(
    'will send sesCode %s to %s in email link',
    sesCode,
    email,
    redirectUrl
  )
  redis.setex(redisSmsKey(email), redisVerifyCacheTime, sesCode)

  const emailLink = `https://auth.weai.life/invitation?email=${email}&sesCode=${sesCode}&redirectUrl=${redirectUrl}`

  if (isProd) await resendInvitationLink(email, emailLink, inviter)
}

export async function sendSes(email: string) {
  const smsCode = genVerificationCode()

  logger.trace('will send smsCode %s to %s', smsCode, email)

  redis.setex(redisSmsKey(email), redisVerifyCacheTime, smsCode)

  if (isProd) await resendSESCode(email, smsCode)
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
    throw new UserInputError('Verification Code is not correct', {
      messages: {
        smsCode: ['Verification Code is not correct'],
      },
    })
  }
}
