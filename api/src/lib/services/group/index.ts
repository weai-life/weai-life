import DB, { Prisma } from '@prisma/client'

import { ValidationError, UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export async function addUserToGroupChannels(groupId: number, userId: number) {
  const channels = await db.channel.findMany({
    where: { groupId },
  })

  const list = channels.map((channel) =>
    db.channelMember.upsert({
      where: {
        membership: {
          channelId: channel.id,
          userId,
        },
      },
      create: {
        channelId: channel.id,
        userId,
        status: 'JOINED',
        source: 'GroupMember',
      },
      update: {
        status: 'JOINED',
        source: 'GroupMember',
      },
    })
  )

  return Promise.all(list)
}

type addUserToGroupByMobileInput = {
  mobile: string
  groupId: number
}
export async function addUserToGroupByMobile({
  mobile,
  groupId,
}: addUserToGroupByMobileInput) {
  const user = await db.user.findUnique({ where: { mobile } })

  if (!user) throw new UserInputError('User not found')

  try {
    logger.debug({
      groupId,
      userId: user.id,
    })

    const groupUser = await db.groupUser.create({
      data: {
        status: 'JOINED',
        groupId,
        userId: user.id,
      },
    })

    await addUserToGroupChannels(groupId, user.id)

    return groupUser
  } catch (err) {
    // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // cannot find user with mobile
      if (err.code === 'P2025') {
        throw new ValidationError('User not found')
      }
    }
    // console.error(err)
    // console.error(err.name)

    throw err
  }
}

export async function addUserToGroup(user: DB.User, group: DB.Group) {
  // If already joined, don't show an error message
  const groupUser = await db.groupUser.upsert({
    where: {
      groupUserRelation: {
        userId: user.id,
        groupId: group.id,
      },
    },
    create: {
      status: 'JOINED',
      userId: user.id,
      groupId: group.id,
    },
    update: {
      status: 'JOINED',
    },
  })

  await addUserToGroupChannels(group.id, user.id)

  return groupUser
}
