import { User, GroupUser } from '@prisma/client'
import { db } from 'src/lib/db'

import { throwForbiddenErrorUnless, isAdmin } from '../lib'

const isSelf = (user: User) => (target: GroupUser) => user.id === target?.userId

const getGroup = (id: number) => db.group.findUnique({ where: { id } })

const isGroupOwner = (user: User) => async (groupId: number) => {
  const group = await getGroup(groupId)
  return user.id === group?.ownerId
}

const membership = (userId: number) => (groupId: number) =>
  db.groupUser.findFirst({
    where: {
      userId,
      groupId,
      status: 'JOINED',
    },
  })

const isGroupMember = (user: User) => async (groupId: number) =>
  !!(await membership(user.id)(groupId))

export const list = (user: User) => async (groupId: number | null) => {
  groupId
    ? throwForbiddenErrorUnless('组成员才可以访问')(
        await isGroupMember(user)(groupId)
      )
    : throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

  return true
}

export const read = (user: User) => async (target: GroupUser) =>
  throwForbiddenErrorUnless('组成员才可以访问')(
    isAdmin(user) || (await isGroupMember(user)(target.groupId))
  )

export const create = (user: User) => async (groupId: number) =>
  throwForbiddenErrorUnless('组管理员才能加新成员')(
    isAdmin(user) || (await isGroupOwner(user)(groupId))
  )

// 状态不能由成员自己修改
export const update = (user: User) => async (target: GroupUser) =>
  throwForbiddenErrorUnless('自己或者组管理员才能修改')(
    isAdmin(user) || (await isGroupOwner(user)(target.groupId))
  )

export const destroy = (user: User) => async (target: GroupUser) =>
  throwForbiddenErrorUnless('组管理员才能删除')(
    isAdmin(user) || (await isGroupOwner(user)(target.groupId))
  )
