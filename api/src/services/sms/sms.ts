import { sms } from 'src/lib/utils'
import { logger } from 'src/lib/logger'

export async function sendSmsCode({ input }) {
  const { mobile } = input

  if (await sms.isNotExpired(mobile)) {
    return {
      status: 'NOT_EXPIRED',
      message: '没有过期可以用上次的验证码',
    }
  }

  try {
    await sms.sendSms(mobile)
    return {
      status: 'SENT',
      message: '短信发送成功',
    }
  } catch (err) {
    logger.error(err)

    return {
      status: 'ERROR',
      message: err.message,
    }
  }
}
