import { ResolverArgs } from '@redwoodjs/graphql-server'
import type { Prisma } from '@prisma/client'
import { authorize, CategoryPolicy as policy } from 'src/lib/policies'
import { paginate } from 'src/lib/utils'

import { db } from 'src/lib/db'

export interface CategorysInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.CategoryWhereInput
  orderBy?: Prisma.CategoryOrderByWithRelationInput
}

export const categories = async ({
  where = {},
  ...input
}: CategorysInputArgs = {}) => {
  await authorize(policy.list)(where.channelId)

  return queryCategorys({
    ...input,
    where,
  })
}

async function queryCategorys({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: CategorysInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.category.findMany({ skip, take, where, orderBy })
    },
  })
}

export const category = ({ id }: Prisma.CategoryWhereUniqueInput) => {
  return db.category.findUnique({
    where: { id },
  })
}

interface CreateCategoryArgs {
  input: Prisma.CategoryUncheckedCreateInput
}

export const createCategory = async ({ input }: CreateCategoryArgs) => {
  await authorize(policy.create)(input.channelId)

  return db.category.create({
    data: input,
  })
}

interface UpdateCategoryArgs extends Prisma.CategoryWhereUniqueInput {
  input: Prisma.CategoryUpdateInput
}

export const updateCategory = async ({ id, input }: UpdateCategoryArgs) => {
  const target = await category({ id })
  await authorize(policy.update)(target)

  return db.category.update({
    data: input,
    where: { id },
  })
}

export const deleteCategory = async ({
  id,
}: Prisma.CategoryWhereUniqueInput) => {
  const target = await category({ id })
  await authorize(policy.destroy)(target)

  return db.category.delete({
    where: { id },
  })
}

export const Category = {
  channel: (_obj, { root }: ResolverArgs<ReturnType<typeof category>>) =>
    db.category.findUnique({ where: { id: root.id } }).channel(),
}
