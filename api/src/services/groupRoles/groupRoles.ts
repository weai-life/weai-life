import { rejectNil } from 'src/lib/utils'
import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'
import { db } from 'src/lib/db'
import { authorize, GroupRolePolicy as policy } from 'src/lib/policies'

type GroupRolesInput = {
  where: Prisma.GroupRoleWhereInput
  orderBy?: Prisma.GroupRoleOrderByWithRelationInput
}
export const groupRoles = async ({
  where,
  orderBy = { id: 'asc' },
}: GroupRolesInput) => {
  await authorize(policy.list)(where.groupId)

  return db.groupRole.findMany({
    where,
    orderBy,
  })
}

export const groupRole = async ({ id }: Prisma.GroupRoleWhereUniqueInput) => {
  const role = await db.groupRole.findUnique({
    where: { id },
  })

  await authorize(policy.read)(role)

  return role
}

type GroupRoleCreateInput = {
  name: string
  description?: string
  groupId: number
  permissionIds: number[]
  userIds?: number[]
}

interface CreateGroupRoleArgs {
  input: GroupRoleCreateInput
}

export const createGroupRole = async ({ input }: CreateGroupRoleArgs) => {
  await authorize(policy.create)(input.groupId)

  const { groupId, permissionIds, userIds, ...rest } = input

  const attributes = {
    ...rest,
    group: {
      connect: { id: groupId },
    },
    permissions: {
      connect: permissionIds.map((id) => ({ id })),
    },
  }

  const data = userIds
    ? {
        ...attributes,
        users: {
          connect: userIds.map((id) => ({ id })),
        },
      }
    : attributes

  return db.groupRole.create({ data })
}

type GroupRoleUpdateInput = {
  name?: string
  description?: string
  permissionIds?: number[]
}

interface UpdateGroupRoleArgs {
  id: number
  input: GroupRoleUpdateInput
}

export const updateGroupRole = async ({ id, input }: UpdateGroupRoleArgs) => {
  const groupRole = await db.groupRole
    .findUnique({ where: { id } })
    .then(rejectNil('未找到'))

  await authorize(policy.update)(groupRole)

  const { permissionIds, ...rest } = input

  const data = rest
  if (permissionIds) {
    data['permissions'] = {
      set: permissionIds.map((id) => ({ id })),
    }
  }

  return db.groupRole.update({
    where: { id },
    data,
  })
}

export const deleteGroupRole = async ({
  id,
}: Prisma.GroupRoleWhereUniqueInput) => {
  const role = await db.groupRole.findUnique({
    where: { id },
  })

  await authorize(policy.destroy)(role)

  return db.groupRole.delete({
    where: { id },
  })
}

export const GroupRole = {
  group: (_obj, { root }: ResolverArgs<ReturnType<typeof groupRole>>) =>
    db.groupRole.findUnique({ where: { id: root.id } }).group(),
  users: (_obj, { root }: ResolverArgs<ReturnType<typeof groupRole>>) =>
    db.groupRole.findUnique({ where: { id: root.id } }).users(),
  permissions: (_obj, { root }: ResolverArgs<ReturnType<typeof groupRole>>) =>
    db.groupRole.findUnique({ where: { id: root.id } }).permissions(),
}

type AddUsersToGroupRoleInput = {
  groupRoleId: number
  userIds: number[]
}

export const addUsersToGroupRole = async ({
  groupRoleId,
  userIds,
}: AddUsersToGroupRoleInput) => {
  const groupRole = await db.groupRole
    .findUnique({ where: { id: groupRoleId } })
    .then(rejectNil('未找到'))

  await authorize(policy.update)(groupRole)

  await db.groupRole.update({
    where: { id: groupRoleId },
    data: {
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  })

  return true
}

type RemoveUsersFromGroupRoleInput = {
  groupRoleId: number
  userIds: number[]
}

export const removeUsersFromGroupRole = async ({
  groupRoleId,
  userIds,
}: RemoveUsersFromGroupRoleInput) => {
  const groupRole = await db.groupRole
    .findUnique({ where: { id: groupRoleId } })
    .then(rejectNil('未找到'))

  await authorize(policy.update)(groupRole)

  await db.groupRole.update({
    where: { id: groupRoleId },
    data: {
      users: {
        disconnect: userIds.map((id) => ({ id })),
      },
    },
  })

  return true
}
