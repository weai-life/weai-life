import { db } from 'src/lib/db'
import { User, ChannelMember } from '@prisma/client'
import { throwForbiddenErrorUnless, isAdmin } from '../lib'

const membership = (userId: number) => (channelId: number) =>
  db.channelMember.findFirst({
    where: {
      userId,
      channelId,
      status: 'JOINED',
    },
  })

const getChannel = (id: number) =>
  db.channel.findUnique({
    where: {
      id,
    },
  })

const isMember = (user: User) => async (channelId: number) =>
  !!(await membership(user.id)(channelId))

const isManager = (user: User) => async (channelId: number) => {
  const result = await membership(user.id)(channelId)

  return !!result?.isAdmin
}

const isOwner = (user: User) => async (channelId: number) => {
  const channel = await getChannel(channelId)
  return channel?.authorId === user.id
}

const channelOwnerId = async (channelId: number) => {
  const channel = await getChannel(channelId)
  return channel?.authorId
}

const isSelf = (user: User) => (target: ChannelMember) =>
  user.id === target.userId

export const read = (user: User) => async (channelId: number) =>
  throwForbiddenErrorUnless('您还不是频道成员无法访问')(
    isAdmin(user) ||
      (await isMember(user)(channelId)) ||
      (await isOwner(user)(channelId))
  )

export const create = (user: User) => async (channelId: number) =>
  throwForbiddenErrorUnless('您不是频道管理员无法访问')(
    isAdmin(user) ||
      (await isManager(user)(channelId)) ||
      (await isOwner(user)(channelId))
  )

export const update = (user: User) => async (channelId: number) =>
  throwForbiddenErrorUnless('您不是频道管理员无法访问')(
    isAdmin(user) ||
      (await isManager(user)(channelId)) ||
      (await isOwner(user)(channelId))
  )

export const destroy = (user: User) => async (target: ChannelMember) => {
  throwForbiddenErrorUnless('不能删除频道主')(
    (await channelOwnerId(target.channelId)) !== target.userId
  )

  throwForbiddenErrorUnless('您不是频道管理员无法访问')(
    isAdmin(user) ||
      (await isManager(user)(target.channelId)) ||
      (await isOwner(user)(target.channelId))
  )

  return true
}

export const quit = (user: User) => async (target: ChannelMember) =>
  throwForbiddenErrorUnless('您不是频道成员无法访问')(
    await isSelf(user)(target)
  )
