import { User, Post } from '@prisma/client'

import { db } from 'src/lib/db'
import * as AccessToken from 'src/lib/utils/accessToken'

import * as ChannelPolicy from '../channelPolicy/channelPolicy'
import { throwForbiddenErrorUnless, isAdmin } from '../lib'

import { rejectNil } from './../../utils/misc'

const isPublicChannel = async (channelId: number) => {
  const channel = await db.channel
    .findUnique({ where: { id: channelId } })
    .then(rejectNil('未找到频道'))
  return await ChannelPolicy.isPublic(channel)
}

const membership = (userId: number) => (channelId: number) =>
  db.channelMember.findFirst({
    where: {
      userId,
      channelId,
      status: 'JOINED',
    },
  })

const isMember = (user: User) => async (channelId: number) =>
  !!(await membership(user.id)(channelId))

const isManager = (user: User) => async (channelId: number) => {
  const result = await membership(user.id)(channelId)

  return !!result?.isAdmin
}

const isAccessedByToken = (token: string) => {
  const json = AccessToken.decode(token)
  return json.type === 'Post' && json.id
}

const isOwner = (user: User) => (target: Post) => target.authorId === user.id

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const read =
  (user: User | null) =>
  async (target: Post, accessToken: string | null = null) => {
    if (accessToken) {
      const id = isAccessedByToken(accessToken)
      if (id === target.id) return true
    }

    if (target.accessType === 'PUBLIC') return true

    user
      ? throwForbiddenErrorUnless('频道成员才能访问')(
          isAdmin(user) ||
            isOwner(user)(target) ||
            (!!target.channelId && (await isPublicChannel(target.channelId))) ||
            (!!target.channelId && (await isMember(user)(target.channelId)))
        )
      : throwForbiddenErrorUnless(
          'You can not access this post, this post is private'
        )(!!target.channelId && (await isPublicChannel(target.channelId)))

    return true
  }

export const create = (user: User) => async (channelId: number | null) => {
  // 没有指定频道id时，可以生成
  if (!channelId) throwForbiddenErrorUnless('您尚未登录')(!!user)
  else
    throwForbiddenErrorUnless(
      'You can not access this post, this post is private'
    )(await isMember(user)(channelId))

  return true
}

type UpdateOptionInput = {
  channelId?: number
}

export const update =
  (user: User) =>
  async (target: Post, option: UpdateOptionInput = {}) => {
    const channelId = option.channelId || target.channelId
    // 没有频道id时
    if (!channelId)
      throwForbiddenErrorUnless('创建者才能修改')(isOwner(user)(target))
    else
      throwForbiddenErrorUnless('频道管理员才能修改')(
        isOwner(user)(target) || (await isManager(user)(channelId))
      )

    return true
  }

export const destroy = (user: User) => async (target: Post) => {
  // 没有频道id时
  if (!target.channelId)
    throwForbiddenErrorUnless('创建者才能删除')(
      isOwner(user)(target) || isAdmin(user)
    )
  else
    throwForbiddenErrorUnless('频道管理员才能删除')(
      isOwner(user)(target) ||
        isAdmin(user) ||
        (await isManager(user)(target.channelId))
    )

  return true
}
