import { User, Template } from '@prisma/client'
import { throwForbiddenErrorUnless, isAdmin } from '../lib'

const isOwner = (user: User) => (target: Template) => user.id === target?.userId

const isLoggedIn = (user?: User) => !!user

export const create = (user?: User) => async () =>
  throwForbiddenErrorUnless('您尚未登录')(isLoggedIn(user))

export const update = (user: User) => async (target: Template) =>
  throwForbiddenErrorUnless('创建者才能修改')(
    isAdmin(user) || isOwner(user)(target)
  )

export const destroy = (user: User) => async (target: Template) =>
  throwForbiddenErrorUnless('创建者才能删除')(
    isAdmin(user) || isOwner(user)(target)
  )
