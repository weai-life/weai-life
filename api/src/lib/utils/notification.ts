/* eslint-disable @typescript-eslint/no-non-null-assertion */
import DB from '@prisma/client'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

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
  const name = channel!.name
  const extras = {
    id: post.id.toString(),
    event: 'NEW_POST',
  }

  return postMessageToUsers({ message, title: name, extras, userIds })
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
  const name = channel!.name
  const extras = {
    event: 'NEW_COMMENT',
    id: comment.id.toString(),
    type: 'Comment',
    postId: post.id,
    channelId: post.channelId,
  }

  return postMessageToUsers({ message, title: name, extras, userIds })
}

export async function postMessageToUsers({ title, message, extras, userIds }) {
  logger.debug('userIds %o', userIds)
  logger.debug('extra %o', extras)
  logger.debug('title %s', title)
  logger.debug('message %s', message)

  // TODO: send message by email
  return null
}
