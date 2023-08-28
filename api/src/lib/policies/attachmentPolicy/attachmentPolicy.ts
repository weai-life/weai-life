import { throwForbiddenErrorUnless, isAdmin } from '../lib'
import { User, Attachment } from '@prisma/client'

const isOwner = (user: User) => (target: Attachment) =>
  user.id === target?.userId

const isPublic = (target: Attachment) => target?.public

const isLoggedIn = (user: User) => !!user

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const read = (user: User) => async (target: Attachment) =>
  throwForbiddenErrorUnless('您无权访问')(
    isAdmin(user) || isOwner(user)(target) || isPublic(target)
  )

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('您尚未登录')(isLoggedIn(user))

export const update = (user: User) => async (target: Attachment) =>
  throwForbiddenErrorUnless('创建者才能修改')(
    isAdmin(user) || isOwner(user)(target)
  )

export const destroy = (user: User) => async (target: Attachment) =>
  throwForbiddenErrorUnless('创建者才能删除')(
    isAdmin(user) || isOwner(user)(target)
  )
