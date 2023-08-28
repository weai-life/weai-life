import { User } from '@prisma/client'
import { isAdmin, throwForbiddenErrorUnless } from '../lib'
import { authorizePostRead, authorizePostUpdate } from './lib'

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const read = (user: User) => async (postId: number) =>
  authorizePostRead(user)(postId)

export const create = (user: User) => async (postId: number) =>
  authorizePostUpdate(user)(postId)

export const update = (user: User) => async (postId: number) =>
  authorizePostUpdate(user)(postId)

export const destroy = (user: User) => async (postId: number) =>
  authorizePostUpdate(user)(postId)
