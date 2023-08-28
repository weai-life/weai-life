import { getCurrentUser } from 'src/lib/context'
import { ResolverArgs } from '@redwoodjs/graphql-server'
import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { paginate, stream } from 'src/lib/utils'

interface PostLikesArgs {
  page?: number
  pageSize?: number
  where?: {
    postId: number
  }
}
export const postLikes = ({ page, pageSize, where }: PostLikesArgs = {}) => {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.postLike.findMany({
        skip,
        take,
        where,
      })
    },
  })
}

interface MyPostLikesArgs {
  page?: number
  pageSize?: number
}
export const myPostLikes = ({ page, pageSize }: MyPostLikesArgs = {}) => {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.postLike.findMany({
        skip,
        take,
        where: {
          userId: getCurrentUser().id,
        },
      })
    },
  })
}

export const postLike = ({ id }: Prisma.PostLikeWhereUniqueInput) => {
  return db.postLike.findUnique({
    where: { id },
  })
}

interface CreatePostLikeArgs {
  input: Omit<Prisma.PostLikeUncheckedCreateInput, 'userId'>
}

export const likePost = async ({ input }: CreatePostLikeArgs) => {
  const data = {
    ...input,
    userId: getCurrentUser().id,
  }

  const postLike = await db.postLike.create({
    data,
  })

  await incrementLikesCount(postLike.postId)
  await stream.postLike(getCurrentUser(), postLike.postId)

  return postLike
}

export const createPostLike = likePost

function incrementLikesCount(postId: number, increment = 1) {
  return db.post.update({
    where: { id: postId },
    data: { likesCount: { increment } },
  })
}

type DislikePostInput = {
  postId: number
}
export const dislikePost = async ({ postId }: DislikePostInput) => {
  const postLike = await db.postLike.delete({
    where: {
      likes: {
        postId,
        userId: getCurrentUser().id,
      },
    },
  })

  await incrementLikesCount(postLike.postId, -1)

  return postLike
}

export const deletePostLike = async ({
  id,
}: Prisma.PostLikeWhereUniqueInput) => {
  const postLike = await db.postLike.delete({
    where: { id },
  })

  await incrementLikesCount(postLike.postId, -1)

  return postLike
}

export const PostLike = {
  user: (_obj, { root }: ResolverArgs<ReturnType<typeof postLike>>) =>
    db.postLike.findUnique({ where: { id: root.id } }).user(),
  post: (_obj, { root }: ResolverArgs<ReturnType<typeof postLike>>) =>
    db.postLike.findUnique({ where: { id: root.id } }).post(),
}
