import { User, BlockUser } from '@prisma/client'

import { throwForbiddenErrorUnless, isAdmin } from '../lib'

const isOwner = (user: User) => (target: BlockUser) =>
  user.id === target?.userId

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const read = (user: User) => async (target: BlockUser) =>
  throwForbiddenErrorUnless('创建者才能访问')(
    isAdmin(user) || isOwner(user)(target)
  )

export const update = (user: User) => async (target: BlockUser) =>
  throwForbiddenErrorUnless('创建者才能修改')(
    isAdmin(user) || isOwner(user)(target)
  )

export const destroy = (user: User) => async (target: BlockUser) =>
  throwForbiddenErrorUnless('创建者才能删除')(
    isAdmin(user) || isOwner(user)(target)
  )
