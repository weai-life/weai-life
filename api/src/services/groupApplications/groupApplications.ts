import { getCurrentUser } from 'src/lib/context'
import DB, { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'
import { authorize, GroupPolicy as policy } from 'src/lib/policies'

import { db } from 'src/lib/db'
import { paginate, rejectNil } from 'src/lib/utils'
import { group as srv } from 'src/lib/services'

type GroupApplicationsInputArgs = {
  page?: number
  pageSize?: number
  where?: Prisma.GroupApplicationWhereInput
  orderBy?: Prisma.GroupApplicationOrderByWithRelationInput
}
export const groupApplications = async ({
  where = {},
  ...input
}: GroupApplicationsInputArgs = {}) => {
  const group = await db.group.findUnique({
    where: { id: where.groupId as number },
  })
  await authorize(policy.reviewApplication)(group)

  const groupApplications = await queryGroupApplications({
    ...input,
    where,
  })

  return groupApplications
}

export const myGroupApplications = async ({
  where = {},
  ...input
}: GroupApplicationsInputArgs = {}) => {
  const user = getCurrentUser()

  const groupApplications = await queryGroupApplications({
    ...input,
    where: { ...where, userId: user.id },
  })

  return groupApplications
}

async function queryGroupApplications({
  page,
  pageSize,
  where,
  orderBy = { id: 'desc' },
}: GroupApplicationsInputArgs) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.groupApplication.findMany({ skip, take, where, orderBy })
    },
  })
}

export const groupApplication = ({
  id,
}: Prisma.GroupApplicationWhereUniqueInput) => {
  return db.groupApplication.findUnique({
    where: { id },
  })
}

interface CreateGroupApplicationArgs {
  input: {
    groupId: number
    content: string
  }
}

export const applyToJoinGroup = ({ input }: CreateGroupApplicationArgs) => {
  return db.groupApplication.create({
    data: {
      ...input,
      userId: getCurrentUser().id,
    },
  })
}

type rejectGroupApplicationInput = {
  id: number
  input: {
    rejectReason: string
  }
}

export const rejectGroupApplication = async ({
  id,
  input,
}: rejectGroupApplicationInput) => {
  const groupApplication = await db.groupApplication
    .findFirst({
      where: { id, status: 'PENDING' },
    })
    .then(rejectNil('找不到申请记录'))

  const group = await db.group
    .findUnique({
      where: { id: groupApplication.groupId },
    })
    .then(rejectNil('找不到小组'))

  await authorize(policy.reviewApplication)(group)

  const user = getCurrentUser()

  const target = await db.groupApplication.update({
    where: { id },
    data: {
      ...input,
      status: 'REJECTED',
      reviewUserId: user.id,
    },
  })

  return target
}

type ApproveGroupApplicationArgs = {
  id: number
}

export const approveGroupApplication = async ({
  id,
}: ApproveGroupApplicationArgs) => {
  const groupApplication = await db.groupApplication
    .findFirst({
      where: { id, status: 'PENDING' },
    })
    .then(rejectNil('找不到申请记录'))

  const group = await db.group
    .findUnique({
      where: { id: groupApplication.groupId },
    })
    .then(rejectNil('找不到小组'))

  await authorize(policy.reviewApplication)(group)

  const user = getCurrentUser()

  const target = await db.groupApplication.update({
    where: { id },
    data: {
      status: 'APPROVED',
      reviewUserId: user.id,
    },
  })

  await srv.addUserToGroup(user, group)

  return target
}

// export const deleteGroupApplication = ({
//   id,
// }: Prisma.GroupApplicationWhereUniqueInput) => {
//   return db.groupApplication.delete({
//     where: { id },
//   })
// }

export const GroupApplication = {
  group: (_obj, { root }: ResolverArgs<ReturnType<typeof groupApplication>>) =>
    db.groupApplication.findUnique({ where: { id: root.id } }).group(),
  user: (_obj, { root }: ResolverArgs<ReturnType<typeof groupApplication>>) =>
    db.groupApplication.findUnique({ where: { id: root.id } }).user(),
}
