import { User } from '@prisma/client'
import { throwForbiddenErrorUnless, isAdmin } from '../lib'

export const read = (user: User) => async () =>
  throwForbiddenErrorUnless('无权读取举报')(isAdmin(user))

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('无权生成举报')(!!user)

export const update = (user: User) => async () =>
  throwForbiddenErrorUnless('无权修改举报')(isAdmin(user))

export const destroy = (user: User) => async () =>
  throwForbiddenErrorUnless('无权删除举报')(isAdmin(user))
