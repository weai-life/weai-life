import { throwForbiddenErrorUnless, isAdmin } from './../lib'
import { User, Category } from '@prisma/client'
import { db } from 'src/lib/db'

const getChannel = (id: number) => db.channel.findUnique({ where: { id } })

const getChannelMember = (userId: number, channelId: number) =>
  db.channelMember.findFirst({ where: { userId, channelId, status: 'JOINED' } })

const canReadChannel = (user: User) => async (channelId: number) => {
  const channel = await getChannel(channelId)
  if (channel?.isPublic) return true

  const channelMember = await getChannelMember(user.id, channelId)
  return !!channelMember
}

const isChannelAdmin = (user: User) => async (channelId: number) => {
  const member = await getChannelMember(user.id, channelId)
  return !!member?.isAdmin
}

export const list =
  (user: User) => async (channelId: number | null | undefined) => {
    if (channelId) {
      throwForbiddenErrorUnless('频道成员才能访问频道分类')(
        isAdmin(user) || (await canReadChannel(user)(channelId))
      )
    } else {
      throwForbiddenErrorUnless('您无权访问')(isAdmin(user))
    }

    return true
  }

export const read = (user: User) => async (target: Category) =>
  throwForbiddenErrorUnless('频道成员才能访问频道分类')(
    isAdmin(user) || (await canReadChannel(user)(target.channelId))
  )

export const create = (user: User) => async (channelId: number) =>
  throwForbiddenErrorUnless('频道管理员才能创建频道分类')(
    isAdmin(user) || (await isChannelAdmin(user)(channelId))
  )

export const update = (user: User) => async (target: Category) =>
  throwForbiddenErrorUnless('频道管理员才能修改频道分类')(
    isAdmin(user) || (await isChannelAdmin(user)(target.channelId))
  )

export const destroy = (user: User) => async (target: Category) =>
  throwForbiddenErrorUnless('频道管理员才能删除频道分类')(
    isAdmin(user) || (await isChannelAdmin(user)(target.channelId))
  )
