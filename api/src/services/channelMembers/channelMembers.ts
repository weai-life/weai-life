import { getCurrentUser } from 'src/lib/context'
import { ResolverArgs, UserInputError } from '@redwoodjs/graphql-server'
import { Prisma } from '@prisma/client'
import { db } from 'src/lib/db'
import { paginate, invite } from 'src/lib/utils'
import { authorize, ChannelMemberPolicy as policy } from 'src/lib/policies'

export interface ChannelMembersInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.ChannelMemberWhereInput
  orderBy?: Prisma.ChannelMemberOrderByWithRelationInput
}

export const channelMembers = async ({
  page,
  pageSize,
  where = { status: 'JOINED' },
  orderBy = { id: 'desc' },
}: ChannelMembersInputArgs = {}) => {
  await authorize(policy.read)(where.channelId)

  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.channelMember.findMany({ skip, take, where, orderBy })
    },
  })
}

export const channelMember = async ({
  id,
}: Prisma.ChannelMemberWhereUniqueInput) => {
  const result = await db.channelMember.findUnique({
    where: { id },
  })

  await authorize(policy.read)(result?.channelId)

  return result
}

interface CreateChannelMemberArgs {
  input: Prisma.ChannelMemberUncheckedCreateInput
}

export const createChannelMember = async ({
  input,
}: CreateChannelMemberArgs) => {
  await authorize(policy.create)(input.channelId)

  return db.channelMember.create({
    data: input,
  })
}

interface UpdateChannelMemberArgs extends Prisma.ChannelMemberWhereUniqueInput {
  input: Prisma.ChannelMemberUpdateInput
}

export const updateChannelMember = async ({
  id,
  input,
}: UpdateChannelMemberArgs) => {
  const result = await db.channelMember.findUnique({
    where: { id },
  })

  throwNotFound(result)
  await authorize(policy.update)(result?.channelId)

  return db.channelMember.update({
    data: input,
    where: { id },
  })
}

export const deleteChannelMember = async ({
  id,
}: Prisma.ChannelMemberWhereUniqueInput) => {
  const result = await db.channelMember.findUnique({
    where: { id },
  })

  throwNotFound(result)
  await authorize(policy.destroy)(result)

  return db.channelMember.delete({
    where: { id },
  })
}

export const ChannelMember = {
  channel: (
    _obj,
    { root }: ResolverArgs<Prisma.ChannelMemberWhereUniqueInput>
  ) => db.channelMember.findUnique({ where: { id: root.id } }).channel(),
  user: (_obj, { root }: ResolverArgs<Prisma.ChannelMemberWhereUniqueInput>) =>
    db.channelMember.findUnique({ where: { id: root.id } }).user(),
}

type JoinChannelInput = {
  id: number
}

export const joinChannel = async ({ id }: JoinChannelInput) => {
  // 如果已经加入则不做错误提示, 如果pending则更新为加入
  const channelMember = await db.channelMember.upsert({
    where: {
      membership: {
        userId: getCurrentUser().id,
        channelId: id,
      },
    },
    create: {
      status: 'JOINED',
      userId: getCurrentUser().id,
      channelId: id,
    },
    update: {
      status: 'JOINED',
    },
  })

  return channelMember
}

type JoinChannelByCodeInput = {
  inviteCode: string
}

export const joinChannelByCode = async ({
  inviteCode,
}: JoinChannelByCodeInput) => {
  const [_, channelId, option] = await invite.getDataByInviteCode(inviteCode)

  if (option.for !== 'channel') {
    throw new Error('该邀请码是小组邀请码')
  }

  // 如果已经加入则不做错误提示
  const channelMember = await db.channelMember.upsert({
    where: {
      membership: {
        userId: getCurrentUser().id,
        channelId,
      },
    },
    create: {
      status: 'JOINED',
      userId: getCurrentUser().id,
      channelId,
    },
    update: {
      status: 'JOINED',
    },
  })

  return channelMember
}

export const quitChannel = async ({ id }: { id: number }) => {
  const result = await db.channelMember.findFirst({
    where: {
      userId: getCurrentUser().id,
      channelId: id,
      status: 'JOINED',
    },
  })

  throwNotFound(result)
  await authorize(policy.quit)(result)

  return db.channelMember.delete({
    where: {
      membership: {
        userId: getCurrentUser().id,
        channelId: id,
      },
    },
  })
}

function throwNotFound(target) {
  if (!target) throw new UserInputError('没有找到')

  return target
}
