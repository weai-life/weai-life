import { getCurrentUser } from 'src/lib/context'
import {
  UserInputError,
  ValidationError,
  context,
  ResolverArgs,
} from '@redwoodjs/graphql-server'
import { Prisma } from '@prisma/client'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { paginate, rejectNil } from 'src/lib/utils'
import {
  authorize,
  ChannelPolicy as policy,
  GroupPolicy,
} from 'src/lib/policies'
import { PostsInputArgs } from './../posts'
import {
  getChannel,
  updateChannelAuthor,
  addUserToChannel,
  postWhereOptionToBlockUser,
} from 'src/lib/utils/dbHelper'
import { removeGroupUsersFromChannel } from './lib/removeGroupUsersFromChannel'
export interface ChannelsInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.ChannelWhereInput
  orderBy?: Prisma.ChannelOrderByWithRelationInput
}

export const publicChannels = async ({
  page,
  pageSize,
  where = {},
  orderBy = { lastPostAt: 'desc' },
}: ChannelsInputArgs = {}) => {
  logger.debug('clientInfo: %o', context.clientInfo)

  where = {
    ...where,
    isPublic: true,
    OR: [
      {
        groupId: null,
      },
      {
        group: {
          is: {
            public: true,
          },
        },
      },
    ],
  }

  return queryChannels({
    page,
    pageSize,
    where,
    orderBy,
  })
}

export const channels = async ({
  page,
  pageSize,
  where = {},
  orderBy = { lastPostAt: 'desc' },
}: ChannelsInputArgs = {}) => {
  logger.debug('clientInfo: %o', context.clientInfo)

  await authorize(policy.list)()

  return queryChannels({
    page,
    pageSize,
    where,
    orderBy,
  })
}

async function queryChannels({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: ChannelsInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.channel.findMany({ skip, take, where, orderBy })
    },
  })
}

export const channel = async ({ id }: Prisma.ChannelWhereUniqueInput) => {
  const target = await db.channel
    .findUnique({
      where: { id },
    })
    .then(rejectNil('未找到该频道'))

  await authorize(policy.read)(target)

  return target
}

interface CreateChannelArgs {
  input: Omit<Prisma.ChannelUncheckedCreateInput, 'authorId'>
}

export const createChannel = async ({ input }: CreateChannelArgs) => {
  if (input.groupId) {
    const group = await db.group.findUnique({ where: { id: input.groupId } })
    if (!group) throw new UserInputError('找不到频道所属小组')
    await authorize(GroupPolicy.addChannel)(group)
  }

  const channel = await db.channel.create({
    data: {
      ...input,
      authorId: getCurrentUser().id,
      channelMembers: {
        create: [
          {
            status: 'JOINED',
            userId: getCurrentUser().id,
            isAdmin: true,
          },
        ],
      },
    },
  })

  if (channel.groupId) {
    await addGroupUsersToChannel(channel.groupId, channel.id)
  }

  return channel
}

interface UpdateChannelArgs extends Prisma.ChannelWhereUniqueInput {
  input: Omit<Prisma.ChannelUncheckedUpdateInput, 'authorId'>
}

export const updateChannel = async ({ id, input }: UpdateChannelArgs) => {
  const channel = await db.channel
    .findUnique({ where: { id } })
    .then(rejectNil('找不到该频道'))

  await authorize(policy.update)(channel)

  // 如果原本是小组频道，并且被更新
  if (
    input.groupId !== undefined && // 没有传 groupId 时保持不变
    channel.groupId &&
    input.groupId !== channel.groupId
  ) {
    const oldGroup = await db.group.findUnique({
      where: { id: channel.groupId },
    })
    await authorize(GroupPolicy.removeChannel)(oldGroup)
  }

  if (input.groupId && channel.groupId != input.groupId) {
    const newGroup = await db.group.findUnique({
      where: { id: input.groupId as number },
    })
    await authorize(GroupPolicy.addChannel)(newGroup)
  }

  // 从原来的小组里删除小组成员
  if (
    input.groupId !== undefined &&
    channel.groupId &&
    channel.groupId != input.groupId
  ) {
    await removeGroupUsersFromChannel(channel?.groupId, channel)
  }

  // 加入所有新小组的成员
  if (input.groupId && channel.groupId != input.groupId) {
    await addGroupUsersToChannel(input.groupId as number, channel.id)
  }

  return db.channel.update({
    data: input,
    where: { id },
  })
}

export const deleteChannel = async ({ id }: Prisma.ChannelWhereUniqueInput) => {
  const channel = await db.channel.findUnique({
    where: { id },
  })

  await authorize(policy.destroy)(channel)

  const result = await db.channel.delete({
    where: { id },
  })

  await db.page.deleteMany({
    where: {
      channelId: result.id,
    },
  })

  return result
}

export interface ChannelMembersInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.ChannelWhereInput
  orderBy?: Prisma.ChannelOrderByWithRelationInput
}

export interface CategoriesInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.CategoryWhereInput
  orderBy?: Prisma.CategoryOrderByWithRelationInput
}

export const Channel = {
  author: (_obj, { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>) =>
    db.channel.findUnique({ where: { id: root.id } }).author(),

  page: (_obj, { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>) =>
    db.channel.findUnique({ where: { id: root.id } }).page(),

  group: (_obj, { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>) =>
    db.channel.findUnique({ where: { id: root.id } }).group(),

  template: (_obj, { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>) =>
    db.channel.findUnique({ where: { id: root.id } }).template(),

  posts: async (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'desc' },
    }: PostsInputArgs = {},
    { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>
  ) => {
    where = {
      isDraft: false,
      ...where,
    }

    if (context.currentUser) {
      where = {
        ...where,
        ...postWhereOptionToBlockUser(getCurrentUser().id),
      }
    }

    return paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.channel
          .findUnique({
            where: { id: root.id },
          })
          .posts({ skip, take, where, orderBy })
      },
    })
  },

  channelMembers: (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'asc' },
    }: ChannelMembersInputArgs = {},
    { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>
  ) =>
    paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.channel
          .findUnique({
            where: { id: root.id },
          })
          .channelMembers({ skip, take, where, orderBy })
      },
    }),

  categories: (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'asc' },
    }: CategoriesInputArgs = {},
    { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>
  ) =>
    paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.channel
          .findUnique({
            where: { id: root.id },
          })
          .categories({ skip, take, where, orderBy })
      },
    }),

  unreadPostCount: async (
    _obj,
    { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>
  ) => {
    const list = await db.channel
      .findUnique({
        where: {
          id: root.id,
        },
      })
      .channelMembers({
        where: {
          userId: getCurrentUser().id,
          status: 'JOINED',
        },
      })

    const channelMember = list[0]
    return channelMember?.unreadPostCount || 0
  },
  postCount: (_obj, { root }) => {
    return db.post.count({
      where: {
        channelId: root.id,
        isDraft: false,
      },
    })
  },

  memberCount: (_obj, { root }) => {
    return db.channelMember.count({
      where: {
        channelId: root.id,
        status: 'JOINED',
      },
    })
  },

  isChannelMember: async (
    _obj,
    { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>
  ) => {
    if (!context.currentUser) return false

    const count = await db.channelMember.count({
      where: {
        channelId: root.id,
        userId: context.currentUser.id,
        status: 'JOINED',
      },
    })

    return count > 0
  },
}

type PullUserToChannelArgs = {
  mobile: string
  channelId: number
}

export const pullUserToChannel = async ({
  mobile,
  channelId,
}: PullUserToChannelArgs) => {
  const channel = await db.channel.findUnique({ where: { id: channelId } })
  await authorize(policy.pullUser)(channel)

  try {
    return await db.channelMember.create({
      data: {
        status: 'JOINED',
        channel: { connect: { id: channelId } },
        user: { connect: { mobile } },
        source: 'Pulled',
      },
    })
  } catch (err) {
    // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // cannot find user with mobile
      if (err.code === 'P2025') {
        throw new ValidationError('没有找到该用户')
      }
    }
    // console.error(err)
    // console.error(err.name)

    throw err
  }
}

async function addGroupUsersToChannel(groupId: number, channelId: number) {
  const groupUsers = await db.groupUser.findMany({
    where: { groupId },
  })

  const list = groupUsers.map((groupUser) =>
    db.channelMember.upsert({
      where: {
        membership: {
          channelId: channelId,
          userId: groupUser.userId,
        },
      },
      create: {
        channelId: channelId,
        userId: groupUser.userId,
        status: 'JOINED',
        source: 'GroupMember',
      },
      update: {
        status: 'JOINED',
        source: 'GroupMember',
      },
    })
  )

  return Promise.all(list)
}

export const myOwnedChannels = ({
  where = {},
  ...input
}: ChannelsInputArgs = {}) =>
  queryChannels({
    ...input,
    where: { ...where, authorId: getCurrentUser().id },
  })

export const myJoinedChannels = ({
  where = {},
  ...input
}: ChannelsInputArgs = {}) =>
  queryChannels({
    ...input,
    where: {
      ...where,
      channelMembers: {
        some: {
          status: 'JOINED',
          userId: getCurrentUser().id,
        },
      },
    },
  })

export const clearUnreadPostCount = async ({
  channelId,
}: {
  channelId: number
}) => {
  const cm = await db.channelMember.findUnique({
    where: {
      membership: {
        channelId,
        userId: getCurrentUser().id,
      },
    },
  })

  if (!cm) {
    throw new UserInputError('不在频道成员内')
  }

  return db.channelMember.update({
    where: {
      id: cm.id,
    },
    data: {
      unreadPostCount: 0,
    },
  })
}

type TransferChannelInput = {
  channelId: number
  userId: number
}

export const transferChannel = async ({
  channelId,
  userId,
}: TransferChannelInput) =>
  getChannel(channelId)
    .then(rejectNil('频道不存在'))
    .then(authorize(policy.transferChannel))
    .then(() => transferChannelToUser(channelId, userId))

function transferChannelToUser(channelId: number, userId: number) {
  return db
    .$transaction([
      updateChannelAuthor(channelId, userId),
      addUserToChannel(channelId, userId, {
        isAdmin: true,
        source: `transfered from user ${context.currentUser?.id}`,
      }),
    ])
    .then(([channel, _member]) => channel)
}
