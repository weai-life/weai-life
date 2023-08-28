import { ResolverArgs } from '@redwoodjs/graphql-server'
import { getCurrentUser } from 'src/lib/context'
import { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { ensure, paginate, rejectNil } from 'src/lib/utils'
import { authorize, BlockUserPolicy as policy } from 'src/lib/policies'
import { getBlockUser, destroyBlockUser } from 'src/lib/utils/dbHelper'

export interface BlockUserInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.BlockUserWhereInput
  orderBy?: Prisma.BlockUserOrderByWithRelationInput
}

export const blockUsers = async ({
  where = {},
  ...input
}: BlockUserInputArgs = {}) => {
  await authorize(policy.list)()

  return queryBlockUsers({
    ...input,
    where,
  })
}

export const myBlockUsers = async ({
  where = {},
  ...input
}: BlockUserInputArgs = {}) => {
  return queryBlockUsers({
    ...input,
    where: {
      ...where,
      userId: getCurrentUser().id,
    },
  })
}

async function queryBlockUsers({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: BlockUserInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.blockUser.findMany({ skip, take, where, orderBy })
    },
  })
}

export const blockUser = ({ id }: Prisma.BlockUserWhereUniqueInput) =>
  getBlockUser(id)
    .then(rejectNil('未找到 blockUser'))
    .then(ensure(authorize(policy.read)))

interface CreateBlockUserArgs {
  input: Prisma.BlockUserUncheckedCreateInput
}

export const createBlockUser = async ({ input }: CreateBlockUserArgs) => {
  const result = await db.blockUser.create({
    data: {
      ...input,
      userId: getCurrentUser().id,
    },
  })

  return result
}

interface UpdateBlockUserArgs extends Prisma.BlockUserWhereUniqueInput {
  input: Prisma.BlockUserUncheckedUpdateInput
}

export const updateBlockUser = async ({ id, input }: UpdateBlockUserArgs) => {
  const blockUser = await db.blockUser.findUnique({ where: { id } })
  await authorize(policy.update)(blockUser)

  const result = await db.blockUser.update({
    data: input,
    where: { id },
  })

  return result
}

export const deleteBlockUser = async ({
  id,
}: Prisma.BlockUserWhereUniqueInput) =>
  getBlockUser(id)
    .then(rejectNil('未找到'))
    .then(ensure(authorize(policy.destroy)))
    .then((x) => destroyBlockUser(x.id))

export const BlockUser = {
  user: async (_obj, { root }: ResolverArgs<ReturnType<typeof blockUser>>) =>
    getBlockUser(root.id).user(),

  blockUser: async (
    _obj,
    { root }: ResolverArgs<ReturnType<typeof blockUser>>
  ) => getBlockUser(root.id).blockUser(),
}
