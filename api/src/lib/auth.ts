import { AuthenticationError, context } from '@redwoodjs/graphql-server'

import { logger } from './logger'

export const requireAuth = () => {
  logger.trace('requireAuth called')
  ensureUser()

  return true
}

export function ensureUser() {
  logger.trace('authorize currentUser: %o', context.currentUser)
  if (!context.currentUser)
    throw new AuthenticationError('You need login to process this request.')
}
