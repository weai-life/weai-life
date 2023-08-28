import { ses } from 'src/lib/utils'
import { logger } from 'src/lib/logger'

export async function sendSesCode({ input }) {
  const { email } = input

  if (await ses.isNotExpired(email)) {
    return {
      status: 'NOT_EXPIRED',
      message: 'Last verfification code not yet expired',
    }
  }

  try {
    await ses.sendSms(email)
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
