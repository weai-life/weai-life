import DB, { Prisma } from '@prisma/client'

import { ResolverArgs } from '@redwoodjs/graphql-server'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'
import { authorize, GroupPolicy as policy } from 'src/lib/policies'
import { group as srv } from 'src/lib/services'
import { invite, paginate, rejectNil } from 'src/lib/utils'

import { ChannelsInputArgs } from './../channels'

export interface GroupsInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.GroupWhereInput
  orderBy?: Prisma.GroupOrderByWithRelationInput
}

async function queryGroups({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: GroupsInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.group.findMany({ skip, take, where, orderBy })
    },
  })
}

export const groups = async ({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: GroupsInputArgs = {}) => {
  await authorize(policy.list)()

  return queryGroups({
    page,
    pageSize,
    where,
    orderBy,
  })
}

export const publicGroups = async ({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: GroupsInputArgs = {}) => {
  return queryGroups({
    page,
    pageSize,
    where: {
      ...where,
      public: true,
    },
    orderBy,
  })
}

export const group = async ({ id }: Prisma.GroupWhereUniqueInput) => {
  const target = await db.group
    .findUnique({
      where: { id },
    })
    .then(rejectNil('未找到这个小程序'))

  await authorize(policy.read)(target)

  return target
}

interface CreateGroupArgs {
  input: Omit<Prisma.GroupUncheckedCreateInput, 'ownerId'>
}

export const createGroup = async ({ input }: CreateGroupArgs) => {
  await authorize(policy.create)()

  return db.group.create({
    data: {
      ...input,
      ownerId: getCurrentUser().id,
      groupUsers: {
        create: [
          {
            status: 'JOINED',
            userId: getCurrentUser().id,
          },
        ],
      },
    },
  })
}

interface UpdateGroupArgs extends Prisma.GroupWhereUniqueInput {
  input: Omit<Prisma.GroupUncheckedUpdateInput, 'ownerId'>
}

export const updateGroup = async ({ id, input }: UpdateGroupArgs) => {
  const group = await db.group.findUnique({ where: { id } })

  await authorize(policy.update)(group)

  return db.group.update({
    data: input,
    where: { id },
  })
}

export const deleteGroup = async ({ id }: Prisma.GroupWhereUniqueInput) => {
  const group = await db.group.findUnique({ where: { id: id } })

  await authorize(policy.destroy)(group)

  const result = await db.group.delete({
    where: { id },
  })

  return result
}

export interface GroupUsersInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.GroupWhereInput
  orderBy?: Prisma.GroupOrderByWithRelationInput
}

export const Group = {
  owner: (_obj, { root }: ResolverArgs<Prisma.GroupWhereUniqueInput>) =>
    db.group.findUnique({ where: { id: root.id } }).owner(),

  channels: async (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'desc' },
    }: ChannelsInputArgs = {},
    { root }: ResolverArgs<Prisma.GroupWhereUniqueInput>
  ) => {
    const user = context.currentUser
    const whereCondition = channelWhere(root as DB.Group, user, where)

    return paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.group
          .findUnique({
            where: { id: root.id },
          })
          .channels({ skip, take, where: whereCondition, orderBy })
      },
    })
  },

  channelList: async (
    _,
    { root }: ResolverArgs<Prisma.GroupWhereUniqueInput>
  ) => {
    const user = context.currentUser
    const where = channelWhere(root as DB.Group, user)
    return db.group.findUnique({ where: { id: root.id } }).channels({ where })
  },

  groupUsers: (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'asc' },
    }: GroupUsersInputArgs = {},
    { root }: ResolverArgs<Prisma.GroupWhereUniqueInput>
  ) =>
    paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.group
          .findUnique({
            where: { id: root.id },
          })
          .groupUsers({ skip, take, where, orderBy })
      },
    }),

  groupUserCount: (
    _obj,
    { root }: ResolverArgs<Prisma.GroupWhereUniqueInput>
  ) =>
    // TODO: skip pending users in the future
    db.group
      .findUnique({
        where: { id: root.id },
        select: { _count: { select: { groupUsers: true } } },
      })
      .then((group) => group?._count?.groupUsers || 0),
  // db.groupUser.count({
  //   where: {
  //     groupId: root.id,
  //     status: 'JOINED',
  //   },
  // }),

  unreadPostCount: async (
    _obj,
    { root }: ResolverArgs<Prisma.GroupWhereUniqueInput>
  ) => {
    const list = await db.group
      .findUnique({
        where: {
          id: root.id,
        },
      })
      .groupUsers({
        where: {
          userId: getCurrentUser().id,
          status: 'JOINED',
        },
      })

    const groupUser = list[0]
    return groupUser?.unreadPostCount || 0
  },

  isGroupUser: async (
    _obj,
    { root }: ResolverArgs<Prisma.GroupWhereUniqueInput>
  ) => {
    if (!context.currentUser) return false

    return !!(await db.groupUser.findFirst({
      where: {
        groupId: root.id,
        userId: context.currentUser.id,
        status: 'JOINED',
      },
    }))
  },
}

type PullUserToGroupArgs = {
  mobile: string
  groupId: number
}

export const pullUserToGroup = async ({
  mobile,
  groupId,
}: PullUserToGroupArgs) => {
  const group = await db.group.findUnique({ where: { id: groupId } })
  await authorize(policy.pullUser)(group)

  return srv.addUserToGroupByMobile({ mobile, groupId })
}

export const myJoinedGroups = ({
  where = {},
  ...input
}: GroupsInputArgs = {}) =>
  queryGroups({
    ...input,
    where: {
      ...where,
      groupUsers: {
        some: {
          status: 'JOINED',
          userId: getCurrentUser().id,
        },
      },
    },
  })

export const myOwnedGroups = ({ where = {}, ...input }: GroupsInputArgs = {}) =>
  queryGroups({
    ...input,
    where: {
      ...where,
      ownerId: getCurrentUser().id,
    },
  })

export const quitGroup = async ({ id }: { id: number }) => {
  await authorize(policy.quit)(id)

  const result = await db.groupUser.delete({
    where: {
      groupUserRelation: {
        userId: getCurrentUser().id,
        groupId: id,
      },
    },
  })

  await removeUserFromGroupChannels(result.groupId, result.userId)

  return result
}

async function removeUserFromGroupChannels(groupId: number, userId: number) {
  const channels = await db.channel.findMany({
    where: {
      groupId,
    },
  })

  const list = channels
    .filter((channel) => channel.authorId != userId)
    .map((channel) =>
      db.channelMember.deleteMany({
        where: {
          channelId: channel.id,
          userId,
        },
      })
    )

  return Promise.all(list)
}

type JoinGroupByCodeInput = {
  inviteCode: string
}

export const joinGroupByCode = async ({ inviteCode }: JoinGroupByCodeInput) => {
  const [_, groupId, option] = await invite.getDataByInviteCode(inviteCode)

  if (option.for !== 'group') {
    throw new Error('该邀请码不是小组邀请码')
  }

  const user = getCurrentUser()
  const group = await db.group
    .findUnique({ where: { id: groupId } })
    .then(rejectNil('找不到小组'))

  return await srv.addUserToGroup(user, group)
}

type JoinPublicGroupInput = {
  groupId: number
}

export const joinPublicGroup = async ({ groupId }: JoinPublicGroupInput) => {
  const group = await db.group
    .findUnique({ where: { id: groupId } })
    .then(rejectNil('找不到小组'))

  if (!group.public) throw new Error('不是公开小组无法加入')

  const user = getCurrentUser()

  return await srv.addUserToGroup(user, group)
}

function channelWhere(
  group: DB.Group,
  user: DB.User | null | undefined,
  where = {}
) {
  if (!user) return publicChannels()
  if (user.isAdmin || group.ownerId == user.id) return allChannels()
  return publicOrJoinedChannels(user, group.public)

  function publicOrJoinedChannels(user: DB.User, isPublic: boolean) {
    const orCondition: object[] = [
      {
        authorId: user.id,
      },
      {
        channelMembers: {
          some: {
            userId: user.id,
          },
        },
      },
    ]

    if (isPublic) orCondition.push({ isPublic: true })

    const condition = isPublic ? { isPublic: true } : {}

    return {
      ...where,
      OR: [
        condition,
        {
          authorId: user.id,
        },
        {
          channelMembers: {
            some: {
              userId: user.id,
            },
          },
        },
      ],
    }
  }

  function publicChannels() {
    return { ...where, isPublic: true }
  }

  function allChannels() {
    return where
  }
}

type SearchUserByMobileInput = {
  groupId: number
  mobile: string
}
export async function searchUserByMobile({
  groupId,
  mobile,
}: SearchUserByMobileInput) {
  const group = db.group
    .findUnique({
      where: { id: groupId },
    })
    .then(rejectNil('找不到小组'))

  await authorize(policy.searchUserByMobile)(group)

  return db.user.findFirst({
    where: {
      mobile,
      groupUsers: {
        some: {
          status: 'JOINED',
          groupId,
        },
      },
    },
  })
}
