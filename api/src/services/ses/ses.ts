import { logger } from 'src/lib/logger'
import { ses } from 'src/lib/utils'

export async function sendSesCode({ input }) {
  const { email } = input

  if (await ses.isNotExpired(email)) {
    return {
      status: 'NOT_EXPIRED',
      message: 'Last log in code not yet expired',
    }
  }

  try {
    await ses.sendSes(email)
    return {
      status: 'SENT',
      message: 'Log in code send successfully',
    }
  } catch (err) {
    logger.error(err)

    return {
      status: 'ERROR',
      message: err.message,
    }
  }
}
