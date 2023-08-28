import { User } from '@prisma/client'
import { throwForbiddenErrorUnless, isAdmin } from '../lib'

const isSelf = (user: User) => (target: User) => user.id === target?.id

export const accessPrivate = (user: User) => async (target: User) =>
  isAdmin(user) || isSelf(user)(target)

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const read = (user: User) => async (target: User) =>
  throwForbiddenErrorUnless('无权访问用户信息')(
    isAdmin(user) || isSelf(user)(target)
  )

export const update = (user: User) => async (target: User) =>
  throwForbiddenErrorUnless('只能修改自己的信息')(
    isAdmin(user) || isSelf(user)(target)
  )
