import { logger } from 'src/lib/logger'
import { ses } from 'src/lib/utils'

export async function sendSesCode({ input }) {
  const { email } = input

  if (await ses.isNotExpired(email)) {
    return {
      status: 'NOT_EXPIRED',
      message: 'Last login code not yet expired',
    }
  }

  try {
    await ses.sendSes(email)
    return {
      status: 'SENT',
      message: 'Login code send successfully',
    }
  } catch (err) {
    logger.error(err)

    return {
      status: 'ERROR',
      message: err.message,
    }
  }
}
