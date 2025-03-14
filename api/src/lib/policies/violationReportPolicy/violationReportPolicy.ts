import { User } from '@prisma/client'

import { throwForbiddenErrorUnless, isAdmin } from '../lib'

export const read = (user: User) => async () =>
  throwForbiddenErrorUnless('No permission to read reports')(isAdmin(user))

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('No permission to create reports')(!!user)

export const update = (user: User) => async () =>
  throwForbiddenErrorUnless('No permission to update reports')(isAdmin(user))

export const destroy = (user: User) => async () =>
  throwForbiddenErrorUnless('No permission to delete reports')(isAdmin(user))
