import { User } from '@prisma/client'
import { throwForbiddenErrorUnless, isAdmin } from '../lib'

export const read = (user: User) => async () =>
  throwForbiddenErrorUnless('无权读取举报分类')(!!user)

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('无权生成举报分类')(isAdmin(user))

export const update = (user: User) => async () =>
  throwForbiddenErrorUnless('无权修改举报分类')(isAdmin(user))

export const destroy = (user: User) => async () =>
  throwForbiddenErrorUnless('无权删除举报分类')(isAdmin(user))
