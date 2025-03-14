import { User, Group } from '@prisma/client'
import { task as T } from 'fp-ts'

import { db } from 'src/lib/db'

import { throwForbiddenErrorUnless, isAdmin, hasPermissionT } from '../lib'

const hasPermissionCreateChannel = hasPermissionT('CREATE_CHANNEL')
const hasPermissionDeleteChannel = hasPermissionT('DELETE_CHANNEL')
const hasPermissionInviteUser = hasPermissionT('INVITE_USER')
const hasPermissionPullUser = hasPermissionT('PULL_USER')
const hasPermisionCreateRole = hasPermissionT('CREATE_ROLE')
const hasPermisionUpdateRole = hasPermissionT('UPDATE_ROLE')

const isOwner = (user: User) => (target: Group) => user.id === target?.ownerId

const hasOwnerPermission: (user: User) => (group: Group) => T.Task<boolean> =
  (user) => (group) =>
    T.of(isAdmin(user) || isOwner(user)(group))

const isLoggedIn = (user: User) => !!user

const membership = (userId: number) => (groupId: number) =>
  db.groupUser.findFirst({
    where: {
      userId,
      groupId,
      status: 'JOINED',
    },
  })

const isMember = (user: User) => async (groupId: number) =>
  !!(await membership(user.id)(groupId))

const isPublic = (target: Group) => target.public

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('You do not have permission to access')(
    isAdmin(user)
  )

export const read = (user: User | null) => async (target: Group) =>
  user
    ? throwForbiddenErrorUnless('You do not have permission to access')(
        isPublic(target) ||
          isAdmin(user) ||
          isOwner(user)(target) ||
          (await isMember(user)(target.id))
      )
    : throwForbiddenErrorUnless('You do not have permission to access')(
        isPublic(target)
      )

export const create = (user: User) => async () =>
  throwForbiddenErrorUnless('You are not logged in')(isLoggedIn(user))

export const update = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('Only the creator can modify')(
    isAdmin(user) || isOwner(user)(target)
  )

export const destroy = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('Only the creator can delete')(
    isAdmin(user) || isOwner(user)(target)
  )

export const addChannel = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('You do not have permission to add channels')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionCreateChannel(user)(target.id)())
  )

export const removeChannel = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('You do not have permission to remove channels')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionDeleteChannel(user)(target.id)())
  )

export const inviteUser = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('You do not have permission to invite users')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionInviteUser(user)(target.id)())
  )

export const pullUser = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('You do not have permission to pull users')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionPullUser(user)(target.id)())
  )

export const join = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('Already in the group')(
    !(await isMember(user)(target.id))
  )

export const quit = (user: User) => async (target: Group) => {
  throwForbiddenErrorUnless('Group creator cannot leave the group')(
    !isOwner(user)(target)
  )

  throwForbiddenErrorUnless('Not in the group')(await isMember(user)(target.id))

  return true
}

// Review and approve user applications to join the group
export const reviewApplication = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless(
    'You do not have permission to review applications'
  )(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermissionInviteUser(user)(target.id)()) ||
      (await hasPermissionPullUser(user)(target.id)())
  )

// 通过手机号查找用户
export const searchUserByMobile = (user: User) => async (target: Group) =>
  throwForbiddenErrorUnless('You do not have permission to search users')(
    (await hasOwnerPermission(user)(target)()) ||
      (await hasPermisionCreateRole(user)(target.id)()) ||
      (await hasPermisionUpdateRole(user)(target.id)())
  )
