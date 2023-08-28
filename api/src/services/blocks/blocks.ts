import { ResolverArgs, context } from '@redwoodjs/graphql-server'
import { getCurrentUser } from 'src/lib/context'
import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { paginate } from 'src/lib/utils'
import { logger } from 'src/lib/logger'
import { authorize, BlockPolicy as policy } from 'src/lib/policies'

export interface BlocksInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.BlockWhereInput
  orderBy?: Prisma.BlockOrderByWithRelationInput
}

export const blocks = async ({
  page,
  pageSize,
  where = {},
  orderBy,
}: BlocksInputArgs = {}) => {
  logger.debug('clientInfo: %o', context.clientInfo)

  await authorize(policy.list)()

  return queryBlocks({
    page,
    pageSize,
    where,
    orderBy,
  })
}

export const myBlocks = async ({
  page,
  pageSize,
  where = {},
  orderBy,
}: BlocksInputArgs = {}) => {
  logger.debug('clientInfo: %o', context.clientInfo)

  await authorize(policy.mine)()

  where = {
    ...where,
    userId: getCurrentUser().id,
  }

  return queryBlocks({
    page,
    pageSize,
    where,
    orderBy,
  })
}

async function queryBlocks({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: BlocksInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.block.findMany({ skip, take, where, orderBy })
    },
  })
}

export const block = async ({ id }: Prisma.BlockWhereUniqueInput) => {
  const block = await db.block.findUnique({
    where: { id },
  })

  await authorize(policy.read)(block)

  return block
}

interface CreateBlockArgs {
  input: Omit<Prisma.BlockUncheckedCreateInput, 'userId'>
}

export const createBlock = async ({ input }: CreateBlockArgs) => {
  await authorize(policy.create)()

  const data = {
    ...input,
    userId: getCurrentUser().id,
  }

  return db.block.create({
    data,
  })
}

interface UpdateBlockArgs extends Prisma.BlockWhereUniqueInput {
  input: Prisma.BlockUpdateInput
}

export const updateBlock = async ({ id, input }: UpdateBlockArgs) => {
  const block = await db.block.findUnique({ where: { id } })

  await authorize(policy.update)(block)

  return db.block.update({
    data: input,
    where: { id },
  })
}

export const deleteBlock = async ({ id }: Prisma.BlockWhereUniqueInput) => {
  const block = await db.block.findUnique({ where: { id } })

  await authorize(policy.destroy)(block)

  return db.block.delete({
    where: { id },
  })
}

export const Block = {
  user: (_obj, { root }: ResolverArgs<ReturnType<typeof block>>) =>
    db.block.findUnique({ where: { id: root.id } }).user(),
  postBlocks: (_obj, { root }: ResolverArgs<ReturnType<typeof block>>) =>
    db.block.findUnique({ where: { id: root.id } }).postBlocks(),
}
