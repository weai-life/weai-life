import { throwForbiddenErrorUnless, isAdmin } from './../lib'
import { User, Block } from '@prisma/client'

const isOwner = (user: User) => (target: Block) => user.id === target?.userId

const isLoggedIn = (user: User) => !!user

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const read = (user: User) => async (target: Block) =>
  throwForbiddenErrorUnless('所有者才能访问')(
    isAdmin(user) || isOwner(user)(target)
  )

export const mine = (user: User) => async () =>
  throwForbiddenErrorUnless('您尚未登录')(isLoggedIn(user))

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('您尚未登录')(isLoggedIn(user))

export const update = (user: User) => async (target: Block) =>
  throwForbiddenErrorUnless('所有者才能更新')(isOwner(user)(target))

export const destroy = (user: User) => async (target: Block) =>
  throwForbiddenErrorUnless('所有者才能删除')(isOwner(user)(target))
