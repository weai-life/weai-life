import { User, Permission } from '@prisma/client'

import { throwForbiddenErrorUnless, isAdmin } from '../lib'

export const CREATE_CHANNEL = '创建频道'
export const UPDATE_CHANNEL = '更新频道'
export const DELETE_CHANNEL = '删除频道'

export const INVITE_MEMBER = '邀请成员'
export const DELETE_MEMBER = '删除成员'

export const CREATE_ROLE = '添加角色'
export const UPDATE_ROLE = '更新角色'
export const DELETE_ROLE = '删除角色'

export const GRANT_ROLE = '授权用户角色'
export const REVOKE_ROLE = '取消用户角色'

export const ALL_PERMISSIONS = {
  CREATE_CHANNEL,
  UPDATE_CHANNEL,
  DELETE_CHANNEL,
  INVITE_MEMBER,
  DELETE_MEMBER,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  GRANT_ROLE,
  REVOKE_ROLE,
}

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const update = (user: User) => async (_target: Permission) =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const destroy = (user: User) => async (_target: Permission) =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))
