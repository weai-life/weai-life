import { User } from '@prisma/client'

import { throwForbiddenErrorUnless, isAdmin } from '../lib'

const isSelf = (user: User) => (target: User) => user?.id === target?.id

export const accessPrivate = (user: User) => async (target: User) =>
  isAdmin(user) || isSelf(user)(target)

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('You do not have permission to access')(
    isAdmin(user)
  )

export const read = (user: User) => async (target: User) =>
  throwForbiddenErrorUnless('No permission to access user information')(
    isAdmin(user) || isSelf(user)(target)
  )

export const update = (user: User) => async (target: User) =>
  throwForbiddenErrorUnless('You can only modify your own information')(
    isAdmin(user) || isSelf(user)(target)
  )
