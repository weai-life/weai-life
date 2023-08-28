import { db } from '../../db'
export * from './postWhereOptionToBlockUser'

export const getPost = (id: number) => db.post.findUnique({ where: { id } })

export const getChannel = (id: number) =>
  db.channel.findUnique({ where: { id } })

export const updateChannelAuthor = (channelId: number, userId: number) =>
  db.channel.update({
    where: {
      id: channelId,
    },
    data: {
      authorId: userId,
    },
  })

export const getChannelMember = (channelId: number, userId: number) =>
  db.channelMember.findFirst({ where: { userId, channelId, status: 'JOINED' } })

export const addUserToChannel = (
  channelId: number,
  userId: number,
  options = {}
) =>
  db.channelMember.upsert({
    where: {
      membership: {
        channelId,
        userId,
      },
    },
    create: {
      channelId,
      userId,
      updatedAt: new Date(),
      status: 'JOINED',
      ...options,
    },
    update: {
      status: 'JOINED',
      ...options,
    },
  })

export const getBlockUser = (id: number | undefined) =>
  db.blockUser.findUnique({ where: { id } })

export const destroyBlockUser = (id: number) =>
  db.blockUser.delete({ where: { id } })
