import { throwNil } from './../../utils/misc'
import { User, Group, Channel } from '@prisma/client'
import { boolean, monoid, task as T } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { db } from 'src/lib/db'
import { throwForbiddenErrorUnless, isAdmin, hasPermissionT } from '../lib'

const hasPermissionCreateChannel = hasPermissionT('CREATE_CHANNEL')
const hasPermissionUpdateChannel = hasPermissionT('UPDATE_CHANNEL')
const hasPermissionDeleteChannel = hasPermissionT('DELETE_CHANNEL')

const isChannelOwner = (user: User) => (channel: Channel) =>
  user.id === channel.authorId

const isGroupOwner = (user: User) => (group: Group) => group.ownerId == user.id

const getGroup: (groupId: number) => T.Task<Group> = (groupId) =>
  pipe(
    () => db.group.findUnique({ where: { id: groupId } }),
    T.map(throwNil('小组不存在'))
  )

export const hasOwnerPermission: (
  user: User
) => (channel: Channel) => T.Task<boolean> = (user) => (channel) =>
  pipe(
    T.sequenceArray([
      T.of(isAdmin(user) || isChannelOwner(user)(channel)),
      channel.groupId
        ? pipe(
            getGroup(channel.groupId),
            T.map((group) => isGroupOwner(user)(group))
          )
        : T.of(false),
    ]),
    T.map(monoid.concatAll(boolean.MonoidAny))
  )

export const isPublic = async (channel: Channel) => {
  if (!channel.isPublic) return false
  if (!channel.groupId) return true

  const group = await getGroup(channel.groupId)()
  return group.public
}

const membership = (userId: number) => (channelId: number) =>
  db.channelMember.findFirst({
    where: {
      userId,
      channelId,
      status: 'JOINED',
    },
  })

const isChannelMember = (user: User) => async (channelId: number) =>
  !!(await membership(user.id)(channelId))

const isManager = (user: User) => async (channelId: number) => {
  const result = await membership(user.id)(channelId)

  return !!result?.isAdmin
}

const isInvitable = (user: User) => async (channelId: number) => {
  const result = await membership(user.id)(channelId)

  return (result && (result.inviteable || result.isAdmin)) || false
}

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const read = (user: User | null) => async (target: Channel) => {
  user
    ? throwForbiddenErrorUnless('您还不是频道成员无权访问')(
        isAdmin(user) ||
          isChannelOwner(user)(target) ||
          (await isPublic(target)) ||
          (await isChannelMember(user)(target.id))
      )
    : throwForbiddenErrorUnless('该频道为私有频道您无权访问')(
        await isPublic(target)
      )

  return true
}

export const create = (user: User) => async (group: Group | null) =>
  throwForbiddenErrorUnless('您没有生成小组频道的权限')(
    isAdmin(user) ||
      !group ||
      isGroupOwner(user)(group) ||
      (await hasPermissionCreateChannel(user)(group.id)())
  )

export const update = (user: User) => async (target: Channel) =>
  throwForbiddenErrorUnless('您没有修改小组频道的权限')(
    (await hasOwnerPermission(user)(target)()) ||
      (!!target.groupId &&
        (await hasPermissionUpdateChannel(user)(target.groupId)()))
  )

export const destroy = (user: User) => async (target: Channel) =>
  throwForbiddenErrorUnless('您没有删除小组频道的权限')(
    (await hasOwnerPermission(user)(target)()) ||
      (!!target.groupId &&
        (await hasPermissionDeleteChannel(user)(target.groupId)()))
  )

export const join = (user: User) => async (target: Channel) =>
  throwForbiddenErrorUnless('已经在频道中了')(
    !(await isChannelMember(user)(target.id))
  )

export const pullUser = (user: User) => async (target: Channel) =>
  throwForbiddenErrorUnless('频道管理员才能拉人')(
    isAdmin(user) ||
      isChannelOwner(user)(target) ||
      (await isManager(user)(target.id))
  )

export const inviteUser = (user: User) => async (target: Channel) =>
  throwForbiddenErrorUnless('您没有邀请权限')(
    isAdmin(user) ||
      isChannelOwner(user)(target) ||
      (await isInvitable(user)(target.id))
  )

export const quit = (user: User) => async (target: Channel) => {
  throwForbiddenErrorUnless('频道创建者不能退出频道')(
    !isChannelOwner(user)(target)
  )

  throwForbiddenErrorUnless('不在频道中')(
    await isChannelMember(user)(target.id)
  )

  return true
}

export const transferChannel = (user: User) => async (target: Channel) =>
  throwForbiddenErrorUnless('频道所有者才能移交频道')(
    isAdmin(user) || isChannelOwner(user)(target)
  )
