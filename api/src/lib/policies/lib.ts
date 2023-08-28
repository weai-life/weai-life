import { ForbiddenError } from '@redwoodjs/graphql-server'
import { User } from '@prisma/client'
import { task as T } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { db } from '../db'

export const throwErrorUnless = (error: Error) => (condition: boolean) => {
  if (!condition) throw error

  return true
}

export const throwForbiddenErrorUnless = (msg: string) =>
  throwErrorUnless(new ForbiddenError(msg))

export const isAdmin = (user: User | null | undefined) => user?.isAdmin === true

export const hasPermission =
  (userId: number) => (groupId: number) => (permissionKey: string) =>
    db.user.findFirst({
      where: {
        id: userId,
        groupRoles: {
          some: {
            groupId,
            permissions: {
              some: {
                key: permissionKey,
              },
            },
          },
        },
      },
    })

export const hasPermissionT: (
  permissionKey: string
) => (user: User) => (groupId: number | null) => T.Task<boolean> =
  (permissionKey) => (user) => (groupId) =>
    !groupId
      ? T.of(false)
      : pipe(
          () => hasPermission(user.id)(groupId)(permissionKey),
          T.map((x) => !!x)
        )
