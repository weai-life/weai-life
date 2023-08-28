import { ResolverArgs } from '@redwoodjs/graphql-server'
import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { authorize, PostBlockPolicy as policy } from 'src/lib/policies'
import { logger } from 'src/lib/logger'

export const postBlocks = async () => {
  await authorize(policy.list)()

  return db.postBlock.findMany()
}

export const postBlock = async ({ id }: Prisma.PostBlockWhereUniqueInput) => {
  const postBlock = await db.postBlock.findUnique({
    where: { id },
  })

  await authorize(policy.read)(postBlock?.postId)

  return postBlock
}

interface CreatePostBlockArgs {
  input: Prisma.PostBlockUncheckedCreateInput
}

export const createPostBlock = async ({ input }: CreatePostBlockArgs) => {
  await authorize(policy.create)(input.postId)

  return db.postBlock.create({
    data: input,
  })
}

interface UpdatePostBlockArgs extends Prisma.PostBlockWhereUniqueInput {
  input: Prisma.PostBlockUpdateInput
}

export const updatePostBlock = async ({ id, input }: UpdatePostBlockArgs) => {
  const postBlock = await db.postBlock.findUnique({ where: { id } })
  await authorize(policy.update)(postBlock?.postId)

  return db.postBlock.update({
    data: input,
    where: { id },
  })
}

export const deletePostBlock = async ({
  id,
}: Prisma.PostBlockWhereUniqueInput) => {
  const postBlock = await db.postBlock.findUnique({ where: { id } })
  await authorize(policy.destroy)(postBlock?.postId)

  return db.postBlock.delete({
    where: { id },
  })
}

export const PostBlock = {
  block: (_obj, { root }: ResolverArgs<ReturnType<typeof postBlock>>) =>
    db.postBlock.findUnique({ where: { id: root.id } }).block(),
  post: (_obj, { root }: ResolverArgs<ReturnType<typeof postBlock>>) =>
    db.postBlock.findUnique({ where: { id: root.id } }).post(),
}

type positionPostBlocksInput = {
  postId: number
  input: {
    ids: number[]
  }
}
export const positionPostBlocks = async ({
  postId,
  input,
}: positionPostBlocksInput) => {
  await authorize(policy.update)(postId)

  for (const [index, id] of input.ids.entries()) {
    logger.debug(`update {postId: ${postId}, id: ${id}, position: ${index}}`)

    await db.postBlock.updateMany({
      where: {
        postId,
        id,
      },
      data: {
        position: index,
      },
    })
  }

  return true
}
