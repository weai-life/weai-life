import { sms } from 'src/lib/utils'
import { logger } from 'src/lib/logger'

export async function sendSmsCode({ input }) {
  const { email } = input

  if (await sms.isNotExpired(email)) {
    return {
      status: 'NOT_EXPIRED',
      message: '没有过期可以用上次的验证码',
    }
  }

  try {
    await sms.sendSms(email)
    return {
      status: 'SENT',
      message: 'Verification Code Send Successfully',
    }
  } catch (err) {
    logger.error(err)

    return {
      status: 'ERROR',
      message: err.message,
    }
  }
}
