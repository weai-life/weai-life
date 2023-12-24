import { Prisma } from '@prisma/client'

import { context, ResolverArgs } from '@redwoodjs/graphql-server'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import {
  authorize,
  PostPolicy as policy,
  ChannelPolicy as channelPolicy,
} from 'src/lib/policies'
import { paginate, notification, AccessToken, rejectNil } from 'src/lib/utils'
import { postWhereOptionToBlockUser } from 'src/lib/utils/dbHelper'

import {
  buildPostBlocksFromBlocks,
  checkCategoryIsBelongsToChannel,
  getLastPublishedAtForPost,
  incrementUnreadPostCount,
  incrementGroupUnreadPostCount,
  updateBlockStat,
  updateLastPostAtForChannel,
} from './lib'

export interface PostsInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.PostWhereInput
  orderBy?: Prisma.PostOrderByWithRelationInput
}

export const posts = async ({ where = {}, ...input }: PostsInputArgs = {}) => {
  await authorize(policy.list)()

  return queryPosts({
    ...input,
    where: {
      ...where,
      isDraft: false,
    },
  })
}

export const publicPosts = async ({
  where = {},
  ...input
}: PostsInputArgs = {}) => {
  return queryPosts({
    ...input,
    where: {
      ...where,
      isDraft: false,
      OR: [
        {
          accessType: 'PUBLIC',
        },
        {
          channel: {
            is: {
              isPublic: true,
            },
          },
        },
      ],
      ...postWhereOptionToBlockUser(context.currentUser?.id),
    },
  })
}

export const channelPosts = async ({
  where = {},
  ...input
}: PostsInputArgs = {}) => {
  const channelId: number = where.channelId as number
  if (!channelId) {
    return new Error('Channel id is required')
  }

  const target = await db.channel
    .findUnique({
      where: { id: channelId },
    })
    .then(rejectNil('Not Found Channel'))

  await authorize(channelPolicy.read)(target)

  return queryPosts({
    ...input,
    where: {
      ...where,
      channelId: target.id,
    },
  })
}

export const myPosts = async ({
  where = {},
  ...input
}: PostsInputArgs = {}) => {
  const whereParams = {
    ...where,
    authorId: getCurrentUser().id,
  }
  // if (where.tagIds) {
  //   whereParams.tags = {
  //     some: {
  //       tagId: {
  //         in: where.tagIds,
  //       },
  //     },
  //   }
  //   delete whereParams.tagIds
  // }
  return queryPosts({
    ...input,
    where: whereParams,
  })
}
async function queryPosts({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: PostsInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.post.findMany({ skip, take, where, orderBy })
    },
  })
}

type PostInput = {
  id: number
  accessToken: string | undefined
}

export const post = async ({ id, accessToken }: PostInput) => {
  const target = await db.post.findUnique({
    where: { id },
  })

  await authorize(policy.read)(target, accessToken)

  return target
}

interface CreatePostArgs {
  input: Omit<Prisma.PostUncheckedCreateInput, 'authorId'> &
    CreateBlocksWithoutUserIdInput
}

interface CreateBlocksWithoutUserIdInput {
  blocks: Omit<Prisma.BlockUncheckedCreateInput, 'userId'>[]
}

export const createPost = async ({ input }: CreatePostArgs) => {
  await authorize(policy.create)(input.channelId)
  await checkCategoryIsBelongsToChannel(input)

  const { blocks, ...nest } = input

  const postBlocks = buildPostBlocksFromBlocks(getCurrentUser(), blocks)

  const data = {
    ...nest,
    postBlocks,
    publishedAt: input.isDraft ? null : new Date(),
    authorId: getCurrentUser().id,
  }

  const post = await db.post.create({
    data,
  })

  if (post.channelId) {
    await incrementUnreadPostCount(getCurrentUser(), post.channelId)
    await incrementGroupUnreadPostCount(getCurrentUser(), post.channelId)
    if (!post.isDraft) {
      await updateLastPostAtForChannel(post.channelId, post.publishedAt)
      // 发送通知
      await notification.newPost(post, getCurrentUser())
    }
  }

  // update block stats with count: blocks.length
  if (blocks) await updateBlockStat(getCurrentUser(), new Date(), blocks.length)

  return post
}

interface UpdatePostArgs extends Prisma.PostWhereUniqueInput {
  input: Omit<Prisma.PostUncheckedUpdateInput, 'authorId'>
}

export const updatePost = async ({ id, input }: UpdatePostArgs) => {
  const post = await db.post.findUnique({ where: { id } })
  await authorize(policy.update)(post, {
    channelId: input.channelId as number,
  })

  await checkCategoryIsBelongsToChannel({
    ...post,
    ...input,
  })

  const data = input

  // 如果从草稿改为发布时，更新发布时间
  if (post?.isDraft && input.isDraft == false) {
    data.publishedAt = new Date()
    logger.debug('changed to published')
  }

  const updatedPost = await db.post.update({
    data,
    where: { id },
  })

  logger.debug('updated post', updatedPost)
  if (data.publishedAt instanceof Date && updatedPost.channelId) {
    await updateLastPostAtForChannel(updatedPost.channelId, data.publishedAt)
    // 发送通知
    await notification.newPost(updatedPost, getCurrentUser())
  }

  return updatedPost
}

export const deletePost = async ({ id }: Prisma.PostWhereUniqueInput) => {
  const post = await db.post.findUnique({ where: { id } })
  await authorize(policy.destroy)(post)

  const result = await db.post.delete({
    where: { id },
  })

  if (result.channelId) {
    logger.debug('update lastPostAt for channelId', result.channelId)
    const publishedAt = await getLastPublishedAtForPost(result.channelId)
    logger.debug('publishedAt', publishedAt)
    await updateLastPostAtForChannel(result.channelId, publishedAt)
  }

  return result
}

export const Post = {
  author: (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) =>
    db.post.findUnique({ where: { id: root.id } }).author(),
  applet: (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) =>
    db.post.findUnique({ where: { id: root.id } }).applet(),
  // FIXME: should we return channel info if the post is accessed by a token
  channel: (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) =>
    db.post.findUnique({ where: { id: root.id } }).channel(),
  topComments: (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) =>
    db.post
      .findUnique({ where: { id: root.id } })
      .comments({ where: { commentId: null } }),
  comments: (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) =>
    db.post.findUnique({ where: { id: root.id } }).comments(),
  category: (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) =>
    db.post.findUnique({ where: { id: root.id } }).category(),
  postBlocks: (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) =>
    db.post.findUnique({ where: { id: root.id } }).postBlocks({
      orderBy: { position: 'asc' },
    }),
  tags: (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) =>
    db.post.findUnique({ where: { id: root.id } }).tags(),

  // 返回当前用户是否赞过该 Post
  liked: async (_obj, { root }: ResolverArgs<Prisma.PostWhereUniqueInput>) => {
    if (!context.currentUser) return false

    const likes = await db.post
      .findUnique({ where: { id: root.id } })
      .postLikes({
        where: {
          userId: context.currentUser.id,
        },
      })

    // console.log('likes', likes)

    return likes.length > 0
  },

  accessToken: async (
    _obj,
    { root }: ResolverArgs<Prisma.PostWhereUniqueInput>
  ) => {
    return AccessToken.encode({
      id: root.id as number,
    })
  },
}
