import { User } from '@prisma/client'

import { parseAuthorizationHeader } from '@redwoodjs/api'
import { context, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'
import { logger } from './logger'
import { jwt } from './utils'

declare module '@redwoodjs/graphql-server' {
  interface GlobalContext {
    currentUser?: User | null
    clientInfo?: jwt.ClientInfo
  }
}

// https://github.com/redwoodjs/redwood/blob/v0.37.4/packages/graphql-server/src/functions/graphql.ts#L96
// https://github.com/redwoodjs/redwood/blob/v0.37.4/packages/graphql-server/src/plugins/useRedwoodAuthContext.ts#L25
// https://github.com/redwoodjs/redwood/blob/v0.37.4/packages/graphql-server/src/plugins/useRedwoodPopulateContext.ts#L19
export const getContext = async ({ context }) => {
  const { event } = context
  if (event.headers?.authorization) {
    const { token } = await parseAuthorizationHeader(event)

    logger.debug('token %s', token)
    return buildContext(token)
  }
}

const buildContext = async (tokenText: string) => {
  logger.trace('token string: %s', tokenText)

  try {
    const token = jwt.verifyToken(tokenText)
    logger.trace('token is: %o', token)
    const currentUser = await loadDbUser(token.sub)

    return {
      clientInfo: token.clientInfo,
      currentUser,
    }
  } catch (err) {
    logger.error('decode token error: %s', err)
    return {
      currentUser: null,
    }
  }
}

export async function loadDbUser(id: number) {
  logger.trace('loadDbUser called')

  const user = await db.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) {
    logger.error('can not find user with id: %d', id)
    throw new ForbiddenError('用户不存在')
  }

  return user
}

export function getCurrentUser() {
  if (!context.currentUser) {
    throw new ForbiddenError('您尚未登录')
  }

  return context.currentUser
}

export function tryGetCurrentUser() {
  return context.currentUser
}

export function getClientInfo() {
  return context.clientInfo
}
