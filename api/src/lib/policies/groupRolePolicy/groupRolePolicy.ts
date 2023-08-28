import { ForbiddenError } from '@redwoodjs/graphql-server'
import { User, GroupRole, Group, GroupUser } from '@prisma/client'
import {
  boolean as B,
  monoid as M,
  task as T,
  option as O,
  taskOption as TO,
} from 'fp-ts'
import { db } from 'src/lib/db'
import { pipe } from 'fp-ts/function'
import { hasPermissionT, isAdmin } from '../lib'

const hasPermisionCreateRole = hasPermissionT('CREATE_ROLE')
const hasPermisionUpdateRole = hasPermissionT('UPDATE_ROLE')
const hasPermisionDeleteRole = hasPermissionT('DELETE_ROLE')

const isGroupOwner = (user: User) => (group: Group) => group.ownerId == user.id

const getGroup: (groupId: number) => TO.TaskOption<Group> = (groupId) =>
  pipe(
    () => db.group.findUnique({ where: { id: groupId } }),
    T.map(O.fromNullable)
  )

const hasOwnerPermission: (user: User) => (group: Group) => T.Task<boolean> =
  (user) => (group) =>
    T.of(isAdmin(user) || isGroupOwner(user)(group))

const membership =
  (userId: number) =>
  (groupId: number): T.Task<GroupUser | null> =>
  () =>
    db.groupUser.findFirst({
      where: {
        userId,
        groupId,
        status: 'JOINED',
      },
    })

const isMember = (user: User) => (groupId: number) =>
  pipe(
    membership(user.id)(groupId),
    T.map((x) => !!x)
  )

const hasMemberPermission: (user: User) => (group: Group) => T.Task<boolean> =
  (user) => (group) =>
    mergeCheckResult([
      hasOwnerPermission(user)(group),
      isMember(user)(group.id),
    ])

const mergeCheckResult = (checks: T.Task<boolean>[]): T.Task<boolean> =>
  M.concatAll(T.getMonoid(B.MonoidAny))(checks)

const checkPermissions = (
  checks: T.Task<boolean>[],
  onResult: (result: boolean) => unknown
) =>
  pipe(
    mergeCheckResult(checks),
    T.map((result) => {
      if (onResult) onResult(result)

      return result
    })
  )

const throwErrorIfFalse = (msg: string) => (result: boolean) =>
  result ? result : throwError(msg)

const throwError = (msg: string): never => {
  throw new ForbiddenError(msg)
}

const throwErrorIfNotFound =
  (msg: string) =>
  <A>(a: TO.TaskOption<A>): T.Task<A> =>
    TO.match(
      () => throwError(msg),
      (b: A) => b
    )(a)

export const listT = (user: User) => (groupId: number) =>
  pipe(
    getGroup(groupId),
    throwErrorIfNotFound('小组不存在'),
    T.chain((group) =>
      pipe(
        checkPermissions(
          [hasMemberPermission(user)(group)],
          throwErrorIfFalse('您不是小组成员无权访问')
        )
      )
    )
  )

export const list = (user: User) => (groupId: number) => listT(user)(groupId)()

export const readT = (user: User) => (target: GroupRole) =>
  pipe(
    getGroup(target.groupId),
    throwErrorIfNotFound('小组不存在'),
    T.chain((group) =>
      pipe(
        checkPermissions(
          [hasMemberPermission(user)(group)],
          throwErrorIfFalse('您不是小组成员无权访问')
        )
      )
    )
  )

export const read = (user: User) => (target: GroupRole) => readT(user)(target)()

export const createT = (user: User) => (groupId: number) =>
  pipe(
    getGroup(groupId),
    throwErrorIfNotFound('小组不存在'),
    T.chain((group) =>
      pipe(
        checkPermissions(
          [
            hasOwnerPermission(user)(group),
            hasPermisionCreateRole(user)(groupId),
          ],
          throwErrorIfFalse('您没有生成小组角色的权限')
        )
      )
    )
  )

export const create = (user: User) => (groupId: number) =>
  createT(user)(groupId)()

export const updateT = (user: User) => (target: GroupRole) =>
  pipe(
    getGroup(target.groupId),
    throwErrorIfNotFound('小组不存在'),
    T.chain((group) =>
      pipe(
        checkPermissions(
          [
            hasOwnerPermission(user)(group),
            hasPermisionUpdateRole(user)(group.id),
          ],
          throwErrorIfFalse('您没有更新小组角色的权限')
        )
      )
    )
  )

export const update = (user: User) => (target: GroupRole) =>
  updateT(user)(target)()

export const destroyT = (user: User) => (target: GroupRole) =>
  pipe(
    getGroup(target.groupId),
    throwErrorIfNotFound('小组不存在'),
    T.chain((group) =>
      pipe(
        checkPermissions(
          [
            hasOwnerPermission(user)(group),
            hasPermisionDeleteRole(user)(group.id),
          ],
          throwErrorIfFalse('您没有删除小组角色的权限')
        )
      )
    )
  )

export const destroy = (user: User) => (target: GroupRole) =>
  destroyT(user)(target)()
