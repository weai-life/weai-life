import { User, Post, Comment, Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

import { getPost } from './dbHelper'
import { uniqBy } from './misc'
import * as notification from './notification'

const contextUrl = 'https://www.w3.org/ns/activitystreams'

export const postComment = async (user: User, comment: Comment) => {
  const post = await getPost(comment.postId)
  if (!post) return

  const list = (await Promise.all([
    commentForComment(user, comment, comment.repliedCommentId),
    commentForComment(user, comment, comment.commentId),
    commentForPost(user, comment, post),
  ]).then((l) =>
    l.filter((x) => !!x).map((x) => ({ ...x, channelId: post.channelId }))
  )) as Prisma.ActivityStreamCreateManyInput[]

  const data = uniqBy((x) => x.userId, list) // 同一个人的只使用最接近的一个

  const userIds = data.map((x) => x.userId)
  await notification.newComment(user, comment, post, userIds)
  return db.activityStream.createMany({ data })
}

export async function commentForPost(user: User, comment: Comment, post: Post) {
  if (post.authorId == user.id) return // 给自己的帖子评论

  return {
    userId: post.authorId,
    data: {
      '@context': contextUrl,
      summary: `用户 ${user.name} 发了评论`,
      type: 'Create',
      actor: { ...dumpUser(user), type: 'User' },
      object: { ...dumpComment(comment), type: 'Comment' },
      target: {
        id: post.id,
        title: post.title,
        shortContent: post.store && post.store['shortContent'],
        type: 'Post',
      },
    },
  }
}

export async function commentForComment(
  user: User,
  comment: Comment,
  commentId: number | null
) {

  if (!commentId) return

  const targetComment = await db.comment.findUnique({
    where: { id: commentId },
  })
  if (!targetComment) return
  if (targetComment.authorId == user.id) return // 给自己的评论回复

  return {
    userId: targetComment.authorId,
    data: {
      '@context': contextUrl,
      summary: `用户 ${user.name} 回复了你的评论`,
      type: 'Create',
      actor: { ...dumpUser(user), type: 'User' },
      object: { ...dumpComment(comment), type: 'Comment' },
      target: {
        id: targetComment.id,
        shortContent: targetComment.content,
        type: 'Comment',
      },
    },
  }
}

export const postLike = async (user: User, postId: number) => {
  const post = await getPost(postId)
  if (!post) return
  if (post.authorId == user.id) return

  const data = {
    userId: post.authorId,
    channelId: post.channelId,
    data: {
      '@context': contextUrl,
      summary: `用户 ${user.name} 点了赞`,
      type: 'Like',
      actor: { ...dumpUser(user), type: 'User' },
      object: { ...dumpPost(post), type: 'Post' },
    },
  }

  return db.activityStream.create({ data })
}

function dumpUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
  }
}

function dumpPost(post: Post) {
  return {
    id: post.id,
    title: post.title,
    shortContent: post.store && post.store['shortContent'],
    content: post.content,
    schema: post.schema,
    channelId: post.channelId,
    authorId: post.authorId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }
}

function dumpComment(comment: Comment) {
  return {
    id: comment.id,
    content: comment.content,
    postId: comment.postId,
    authorId: comment.authorId,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  }
}
