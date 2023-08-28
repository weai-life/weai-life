import { getCurrentUser } from 'src/lib/context'
import type { Prisma } from '@prisma/client'
import { db } from 'src/lib/db'
import { paginate } from 'src/lib/utils'
import { authorize, GroupUserPolicy as policy } from 'src/lib/policies'

type ResolverArgs<T> = { root: T }

export interface GroupUsersInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.GroupUserWhereInput
  orderBy?: Prisma.GroupUserOrderByWithRelationInput
}

export const groupUsers = async ({
  page,
  pageSize,
  where = { status: 'JOINED' },
  orderBy = { id: 'desc' },
}: GroupUsersInputArgs = {}) => {
  await authorize(policy.read)(where.groupId)

  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.groupUser.findMany({ skip, take, where, orderBy })
    },
  })
}

export const groupUser = async ({ id }: Prisma.GroupUserWhereUniqueInput) => {
  const target = await db.groupUser.findUnique({
    where: { id },
  })

  await authorize(policy.read)(target)

  return target
}

interface UpdateGroupUserArgs extends Prisma.GroupUserWhereUniqueInput {
  input: Omit<Prisma.GroupUserUncheckedUpdateInput, 'ownerId'>
}

export const updateGroupUser = async ({ id, input }: UpdateGroupUserArgs) => {
  const target = await db.groupUser.findUnique({ where: { id } })

  await authorize(policy.update)(target)

  return db.groupUser.update({
    data: input,
    where: { id },
  })
}

export const deleteGroupUser = async ({
  id,
}: Prisma.GroupUserWhereUniqueInput) => {
  const target = await db.groupUser.findUnique({ where: { id: id } })

  await authorize(policy.destroy)(target)

  const result = await db.groupUser.delete({
    where: { id },
  })

  return result
}

export const GroupUser = {
  group: (_obj, { root }: ResolverArgs<Prisma.GroupUserWhereUniqueInput>) =>
    db.groupUser.findUnique({ where: { id: root.id } }).group(),
  user: (_obj, { root }: ResolverArgs<Prisma.GroupUserWhereUniqueInput>) =>
    db.groupUser.findUnique({ where: { id: root.id } }).user(),
}

export const clearGroupUnreadPostCount = ({ groupId }: { groupId: number }) => {
  return db.groupUser.update({
    where: {
      groupUserRelation: {
        groupId,
        userId: getCurrentUser().id,
      },
    },
    data: {
      unreadPostCount: 0,
    },
  })
}
