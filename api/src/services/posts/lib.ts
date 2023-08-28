import { UserInputError } from '@redwoodjs/graphql-server'
import DB from '@prisma/client'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import moment from 'moment-timezone'

export function buildPostBlocksFromBlocks(user: DB.User, blocks) {
  if (blocks) {
    const data = blocks.map((block, index) => {
      return {
        position: index,
        block: {
          create: {
            ...block,
            userId: user.id,
          },
        },
      }
    })

    return {
      create: data,
    }
  } else {
    return {}
  }
}

export function incrementUnreadPostCount(user: DB.User, channelId: number) {
  return db.channelMember.updateMany({
    where: {
      channelId,
      status: 'JOINED',
      userId: {
        not: user.id,
      },
    },
    data: {
      unreadPostCount: {
        increment: 1,
      },
    },
  })
}

export async function incrementGroupUnreadPostCount(
  user: DB.User,
  channelId: number
) {
  const channel = await db.channel.findUnique({ where: { id: channelId } })

  if (channel?.groupId) {
    return db.groupUser.updateMany({
      where: {
        groupId: channel.groupId,
        status: 'JOINED',
        userId: {
          not: user.id,
        },
      },
      data: {
        unreadPostCount: {
          increment: 1,
        },
      },
    })
  }
}

export function updateLastPostAtForChannel(
  channelId: number,
  date: Date | null = new Date()
) {
  logger.debug('date', date)
  if (date) {
    return db.channel.update({
      where: {
        id: channelId,
      },
      data: {
        lastPostAt: date,
      },
    })
  } else {
    return db.$executeRaw`
      UPDATE "Channel" SET "lastPostAt" = "createdAt" WHERE ID = ${channelId};
    `
  }
}

const TZ_SHANGHAI = 'Asia/Shanghai'
const timeInTimezone = (format: string) => (timezone: string) => (date: Date) =>
  moment(date).tz(timezone).format(format)
const dateInTimezone = timeInTimezone('YYYY-MM-DD')
export const dateInChina = dateInTimezone(TZ_SHANGHAI)

export async function updateBlockStat(
  user: DB.User,
  datetime: Date,
  count: number
) {
  const date = dateInChina(datetime)

  return await db.activityStat.upsert({
    where: {
      userIdDateUnique: {
        date,
        userId: user.id,
      },
    },
    update: {
      count: {
        increment: count,
      },
    },
    create: {
      userId: user.id,
      date,
      count,
    },
  })
}

export async function getLastPublishedAtForPost(channelId: number) {
  const post = await db.post.findFirst({
    where: {
      channelId,
      NOT: {
        publishedAt: null,
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 1,
  })

  // 不能使用 post?.publishedAt 写法，这样会返回 undefinded
  return post && post.publishedAt
}

export async function checkCategoryIsBelongsToChannel(input) {
  const { channelId, categoryId } = input

  if (!categoryId) return

  const category = await db.category.findUnique({
    where: { id: categoryId },
  })

  if (category?.channelId !== channelId)
    throw new UserInputError('分类与频道不一致')
}
