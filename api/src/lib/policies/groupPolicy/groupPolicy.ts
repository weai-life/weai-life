import { User, Group } from '@prisma/client'
import { db } from 'src/lib/db'
import { task as T } from 'fp-ts'

import { throwForbiddenErrorUnless, isAdmin, hasPermissionT } from '../lib'

const hasPermissionCreateChannel = hasPermissionT('CREATE_CHANNEL')
const hasPermissionDeleteChannel = hasPermissionT('DELETE_CHANNEL')
const hasPermissionInviteUser = hasPermissionT('INVITE_USER')
const hasPermissionPullUser = hasPermissionT('PULL_USER')
const hasPermisionCreateRole = hasPermissionT('CREATE_ROLE')
const hasPermisionUpdateRole = hasPermissionT('UPDATE_ROLE')

const isOwner = (user: User) => (target: Group) => user.id === target?.ownerId

const hasOwnerPermission: (user: User) => (group: Group) => T.Task<boolean> =
  (user) => (group) =>
    T.of(isAdmin(user) || isOwner(user)(group))

const isLoggedIn = (user: User) => !!user

const membership = (userId: number) => (groupId: number) =>
  db.groupUser.findFirst({
    where: {
      userId,
      groupId,
      status: 'JOINED',
    },
  })

const isMember = (user: User) => async (groupId: number) =>
  !!(await membership(user.id)(groupId))

const isPublic = (target: Group) => target.public

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const read = (user: User | null) => async (target: Group) =>
  user
    ? throwForbiddenErrorUnless('您无权访问')(
        isPublic(target) ||
          isAdmin(user) ||
          isOwner(user)(target) ||
          (await isMember(user)(target.id))
      )
    : throwForbiddenErrorUnless('您无权访问')(isPublic(target))

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('您尚未登录')(isLoggedIn(user))

export const update = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('创建者才能修改')(
    isAdmin(user) || isOwner(user)(target)
  )

export const destroy = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('创建者才能删除')(
    isAdmin(user) || isOwner(user)(target)
  )

export const addChannel = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('您没有添加频道的权限')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionCreateChannel(user)(target.id)())
  )

export const removeChannel = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('您没有删除频道的权限')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionDeleteChannel(user)(target.id)())
  )

export const inviteUser = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('您没有邀请用户的权限')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionInviteUser(user)(target.id)())
  )

export const pullUser = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('您没有拉用户的权限')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionPullUser(user)(target.id)())
  )

export const join = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('已经在小组了')(!(await isMember(user)(target.id)))

export const quit = (user: User) => async (target: Group) => {
  throwForbiddenErrorUnless(' 小组创建者不能退出频道')(!isOwner(user)(target))

  throwForbiddenErrorUnless('不在小组中')(await isMember(user)(target.id))

  return true
}

// 审核批准用户申请加入小组
export const reviewApplication = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('您没有审核申请的权限')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionInviteUser(user)(target.id)()) ||
      (await hasPermissionPullUser(user)(target.id)())
  )

// 通过手机号查找用户
export const searchUserByMobile = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('您没有查找用户的权限')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermisionCreateRole(user)(target.id)()) ||
      (await hasPermisionUpdateRole(user)(target.id)())
  )
