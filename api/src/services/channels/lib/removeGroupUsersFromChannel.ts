import DB from '@prisma/client'

import { db } from 'src/lib/db'

export async function removeGroupUsersFromChannel(
  groupId: number,
  channel: DB.Channel
) {
  const groupUsers = await db.groupUser.findMany({
    where: { groupId },
  })

  const list = groupUsers
    .filter((groupUser) => groupUser.userId != channel.authorId) // Skip the channel creator
    .map((groupUser) =>
      // Using deleteMany won't throw an error even if no records are found
      db.channelMember.deleteMany({
        where: {
          channelId: channel.id,
          userId: groupUser.userId,
        },
      })
    )

  return Promise.all(list)
}
