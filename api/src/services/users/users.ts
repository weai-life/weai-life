import { getCurrentUser } from 'src/lib/context'
import { ResolverArgs, context } from '@redwoodjs/graphql-server'
import { db } from 'src/lib/db'
import DB, { Prisma } from '@prisma/client'
import { paginate } from 'src/lib/utils'
import { PostsInputArgs } from '../posts/posts'
import { TodosInputArgs } from '../todos/todos'
import { ChannelsInputArgs } from '../channels/channels'
import { authorize, UserPolicy as policy } from 'src/lib/policies'

interface UsersArgs {
  page?: number
  pageSize?: number
}

export const users = async ({ page, pageSize }: UsersArgs = {}) => {
  await authorize(policy.list)()

  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.user.findMany({ skip, take })
    },
  })
}

export const user = async ({ id }: Prisma.UserWhereUniqueInput) => {
  const result = await db.user.findUnique({ where: { id } })

  await authorize(policy.read)(result)

  return result
}

export const profile = () => {
  return getCurrentUser()
}

export const updateProfile = ({ input }) => {
  return db.user.update({
    data: input,
    where: {
      id: getCurrentUser().id,
    },
  })
}

type ChannelMembersArgs = {
  page?: number
  pageSize?: number
  status?: 'JOINED' | 'PENDING'
}

export const User = {
  mobile: async (_obj, { root }: ResolverArgs<DB.User>) => {
    const result = await policy.accessPrivate(getCurrentUser())(root)
    return result ? root.mobile : ''
  },

  isAdmin: (_obj, { root }: ResolverArgs<DB.User>) => {
    // 当前用户是管理员是才会返回用户的信息，否则都返回 否
    return context.currentUser?.isAdmin ? root.isAdmin : false
  },

  postCount: (_obj, { root }: ResolverArgs<DB.User>) => {
    return db.post.count({ where: { authorId: root.id, isDraft: false } })
  },

  joinedGroupCount: (_obj, { root }: ResolverArgs<DB.User>) => {
    return db.groupUser.count({ where: { userId: root.id, status: 'JOINED' } })
  },

  joinedChannelCount: (_obj, { root }: ResolverArgs<DB.User>) => {
    return db.channelMember.count({
      where: { userId: root.id, status: 'JOINED' },
    })
  },

  channelMembers: (
    { page, pageSize, status }: ChannelMembersArgs = {},
    { root }: ResolverArgs<Prisma.ChannelMemberWhereUniqueInput>
  ) => {
    const where = status ? { status } : {}
    return paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.user.findUnique({ where: { id: root.id } }).channelMembers({
          where,
          skip,
          take,
        })
      },
    })
  },

  posts: async (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'desc' },
    }: PostsInputArgs = {},
    { root }: ResolverArgs<Prisma.PostWhereUniqueInput>
  ) =>
    paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.user.findUnique({ where: { id: root.id } }).posts({
          skip,
          take,
          where,
          orderBy,
        })
      },
    }),

  ownedChannels: (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'desc' },
    }: ChannelsInputArgs = {},
    { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>
  ) =>
    paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.user
          .findUnique({ where: { id: root.id } })
          .channels({ skip, take, where, orderBy })
      },
    }),

  // joinedChannels: (
  //   { page = 1 } = {},
  //   { root }: ResolverArgs<Prisma.ChannelWhereUniqueInput>
  // ) =>
  //   paginate({
  //     page,
  //     fun: ({ skip, take }) => {
  //       return db.user
  //         .findUnique({
  //           where: { id: root.id },
  //           include: {
  //             channelMembers: {
  //               skip,
  //               take,
  //               include: { channel: true },
  //             },
  //           },
  //         })
  //         .then((u) => u?.channelMembers.map((m) => m.channel) || [])
  //     },
  //   }),

  todos: async (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'desc' },
    }: TodosInputArgs = {},
    { root }: ResolverArgs<ReturnType<typeof user>>
  ) =>
    paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.user.findUnique({ where: { id: root.id } }).todos({
          skip,
          take,
          where,
          orderBy,
        })
      },
    }),
}
