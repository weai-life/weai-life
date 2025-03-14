import { User } from '@prisma/client'

import { throwForbiddenErrorUnless, isAdmin } from '../lib'

export const read = (user: User) => async () =>
  throwForbiddenErrorUnless('No permission to read violation categories')(
    !!user
  )

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('No permission to create violation categories')(
    isAdmin(user)
  )

export const update = (user: User) => async () =>
  throwForbiddenErrorUnless('No permission to update violation categories')(
    isAdmin(user)
  )

export const destroy = (user: User) => async () =>
  throwForbiddenErrorUnless('No permission to delete violation categories')(
    isAdmin(user)
  )
