import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { authorize, PermissionPolicy as policy } from 'src/lib/policies'

export interface PermissionsInputArgs {
  where?: Prisma.PermissionWhereInput
  orderBy?: Prisma.PermissionOrderByWithRelationInput
}

export const permissions = async ({
  where = {},
  orderBy = { id: 'asc' },
}: PermissionsInputArgs = {}) => {
  return db.permission.findMany({
    where,
    orderBy,
  })
}

export const permission = async ({ id }: Prisma.PermissionWhereUniqueInput) => {
  return db.permission.findUnique({
    where: { id },
  })
}

interface CreatePermissionArgs {
  input: Prisma.PermissionCreateInput
}

export const createPermission = async ({ input }: CreatePermissionArgs) => {
  await authorize(policy.create)()

  return db.permission.create({
    data: input,
  })
}

interface UpdatePermissionArgs extends Prisma.PermissionWhereUniqueInput {
  input: Prisma.PermissionUpdateInput
}

export const updatePermission = async ({ id, input }: UpdatePermissionArgs) => {
  await authorize(policy.update)()

  return db.permission.update({
    data: input,
    where: { id },
  })
}

export const deletePermission = async ({
  id,
}: Prisma.PermissionWhereUniqueInput) => {
  await authorize(policy.destroy)()

  return db.permission.delete({
    where: { id },
  })
}

export const Permission = {
  rolePermissions: (
    _obj,
    { root }: ResolverArgs<ReturnType<typeof permission>>
  ) => db.permission.findUnique({ where: { id: root.id } }).rolePermissions(),
}
