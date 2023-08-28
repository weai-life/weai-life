import { getCurrentUser } from 'src/lib/context'
import { ResolverArgs, UserInputError } from '@redwoodjs/graphql-server'
import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { paginate, rejectNil, stream } from 'src/lib/utils'
import { authorize, CommentPolicy as policy } from 'src/lib/policies'
import { miniprogram as mp } from 'src/lib/services'

export interface CommentsInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.CommentWhereInput
  orderBy?: Prisma.CommentOrderByWithRelationInput
}

export const comments = async ({
  where = {},
  ...input
}: CommentsInputArgs = {}) => {
  await authorize(policy.list)(where)

  return queryComments({
    ...input,
    where,
  })
}

export const myComments = async ({
  where = {},
  ...input
}: CommentsInputArgs = {}) =>
  queryComments({
    ...input,
    where: {
      ...where,
      authorId: getCurrentUser().id,
    },
  })

async function queryComments({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: CommentsInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.comment.findMany({ skip, take, where, orderBy })
    },
  })
}

export const comment = async ({ id }: Prisma.CommentWhereUniqueInput) => {
  const target = await db.comment
    .findUnique({
      where: { id },
    })
    .then(rejectNil('未找到该评论'))

  await authorize(policy.read)(target)

  return target
}

interface CreateCommentArgs {
  input: Omit<Prisma.CommentUncheckedCreateInput, 'authorId'>
}

export const createComment = async ({ input }: CreateCommentArgs) => {
  await authorize(policy.create)(input.postId)

  if (!input.postId && !input.repliedCommentId) {
    throw new UserInputError('postId repliedCommentId 必须提供一个')
  }

  const repliedCommentId = input.repliedCommentId

  if (repliedCommentId) {
    const repliedComment = await comment({ id: repliedCommentId })

    if (!repliedComment) throw new UserInputError('repliedComemntId 找不到')

    input.commentId = repliedComment.commentId || repliedComment.id
    if (input.postId !== repliedComment.postId)
      throw new UserInputError('评论 postId 与参数的 postId 不一致')
  }

  await checkContent(input.content)

  const result = await db.comment.create({
    data: {
      ...input,
      authorId: getCurrentUser().id,
    },
  })

  await incrementCountForPost(result.postId)
  if (result.commentId) await incrementCountForComment(result.commentId)
  await stream.postComment(getCurrentUser(), result)

  return result
}

const checkContent = async (content: string | null | undefined) => {
  if (content) await mp.checkCommentContent(content)
}

function incrementCountForPost(postId, increment = 1) {
  return db.post.update({
    where: { id: postId },
    data: {
      commentsCount: {
        increment,
      },
    },
  })
}

function incrementCountForComment(commentId, increment = 1) {
  return db.comment.update({
    where: { id: commentId },
    data: {
      commentsCount: {
        increment,
      },
    },
  })
}

interface UpdateCommentArgs extends Prisma.CommentWhereUniqueInput {
  input: Omit<Prisma.CommentUncheckedUpdateInput, 'authorId'>
}

export const updateComment = async ({ id, input }: UpdateCommentArgs) => {
  const comment = await db.comment.findUnique({ where: { id } })
  await authorize(policy.update)(comment?.postId)
  logger.debug('update comment', comment)

  await checkContent(input.content as string | undefined)

  return db.comment.update({
    data: input,
    where: { id },
  })
}

export const deleteComment = async ({ id }: Prisma.CommentWhereUniqueInput) => {
  const comment = await db.comment.findUnique({ where: { id } })
  await authorize(policy.destroy)(comment?.postId)
  logger.debug('delete comment', comment)

  const result = await db.comment.delete({
    where: { id },
  })

  await incrementCountForPost(result.postId, -1)
  if (result.commentId) await incrementCountForComment(result.commentId, -1)

  return result
}

export const Comment = {
  author: (_obj, { root }: ResolverArgs<ReturnType<typeof comment>>) =>
    db.comment.findUnique({ where: { id: root.id } }).author(),
  post: (_obj, { root }: ResolverArgs<ReturnType<typeof comment>>) =>
    db.comment.findUnique({ where: { id: root.id } }).post(),
  comment: (_obj, { root }: ResolverArgs<ReturnType<typeof comment>>) =>
    db.comment.findUnique({ where: { id: root.id } }).comment(),

  comments: async (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'asc' },
    }: CommentsInputArgs = {},
    { root }: ResolverArgs<Prisma.CommentWhereUniqueInput>
  ) => {
    return paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.comment
          .findUnique({
            where: { id: root.id },
          })
          .comments({ skip, take, where, orderBy })
      },
    })
  },

  repliedComment: (_obj, { root }: ResolverArgs<ReturnType<typeof comment>>) =>
    db.comment.findUnique({ where: { id: root.id } }).repliedComment(),
  replies: (_obj, { root }: ResolverArgs<ReturnType<typeof comment>>) =>
    db.comment.findUnique({ where: { id: root.id } }).replies(),
}
