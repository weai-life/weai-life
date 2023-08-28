import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { authorize, ViolationCategoryPolicy as policy } from 'src/lib/policies'

export const violationCategories = async () => {
  await authorize(policy.read)()

  return db.violationCategory.findMany()
}

export const violationCategory = async ({
  id,
}: Prisma.ViolationCategoryWhereUniqueInput) => {
  await authorize(policy.read)()

  return db.violationCategory.findUnique({
    where: { id },
  })
}

interface CreateViolationCategoryArgs {
  input: Prisma.ViolationCategoryCreateInput
}

export const createViolationCategory = async ({
  input,
}: CreateViolationCategoryArgs) => {
  await authorize(policy.create)()

  return db.violationCategory.create({
    data: input,
  })
}

interface UpdateViolationCategoryArgs
  extends Prisma.ViolationCategoryWhereUniqueInput {
  input: Prisma.ViolationCategoryUpdateInput
}

export const updateViolationCategory = async ({
  id,
  input,
}: UpdateViolationCategoryArgs) => {
  await authorize(policy.update)()

  return db.violationCategory.update({
    data: input,
    where: { id },
  })
}

export const deleteViolationCategory = async ({
  id,
}: Prisma.ViolationCategoryWhereUniqueInput) => {
  await authorize(policy.destroy)()

  return db.violationCategory.delete({
    where: { id },
  })
}

export const ViolationCategory = {
  ViolationReport: (
    _obj,
    { root }: ResolverArgs<ReturnType<typeof violationCategory>>
  ) =>
    db.violationCategory
      .findUnique({ where: { id: root.id } })
      .ViolationReport(),
}
