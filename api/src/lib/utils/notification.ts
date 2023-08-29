/* eslint-disable @typescript-eslint/no-non-null-assertion */
import DB from '@prisma/client'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

import * as jpush from './jpush'

export async function newPost(post: DB.Post, currentUser: DB.User) {
  logger.debug('newPost')

  if (!post.channelId) return

  // 获得频道内用户id
  const channelMembers = await db.channelMember.findMany({
    where: {
      status: 'JOINED',
      channelId: post.channelId,
      userId: {
        not: currentUser.id,
      },
    },
  })
  const userIds = channelMembers.map((d) => d.userId)

  const message = `${currentUser.name}: ${postMessage(post)}`

  const channel = await db.channel.findUnique({ where: { id: post.channelId } })
  const title = channel!.title
  const extras = {
    id: post.id.toString(),
    event: 'NEW_POST',
  }

  return postMessageToUsers({ message, title, extras, userIds })
}

function postMessage(post) {
  if (post.store && 'shortContent' in post.store) {
    return post.store['shortContent'] || '[无文本]'
  } else {
    return '发了新文章'
  }
}

export async function newComment(
  currentUser: DB.User,
  comment: DB.Comment,
  post: DB.Post,
  userIds: number[]
) {
  logger.debug('newComment')

  if (!post) return
  if (!post.channelId) return
  if (userIds.length == 0) return

  const message = `${currentUser.name}: ${comment.content}`

  const channel = await db.channel.findUnique({ where: { id: post.channelId } })
  const title = channel!.title
  const extras = {
    event: 'NEW_COMMENT',
    id: comment.id.toString(),
    type: 'Comment',
    postId: post.id,
    channelId: post.channelId,
  }

  return postMessageToUsers({ message, title, extras, userIds })
}

export async function postMessageToUsers({ title, message, extras, userIds }) {
  logger.debug('userIds %o', userIds)
  logger.debug('extra %o', extras)
  logger.debug('message %s', message)

  // 过滤有设备号的id
  const userDeivces = await db.userDevice.findMany({
    where: {
      userId: {
        in: userIds,
      },
      NOT: {
        devices: {
          isEmpty: true,
        },
      },
    },
  })

  // 空时不做推送
  if (userDeivces.length === 0) return true

  const alias = userDeivces.map((x) => x.userId.toString())
  logger.debug('alias %o', alias)

  return jpush.pushMessage(alias, message, title, extras)
}
