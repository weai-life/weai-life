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
    .filter((groupUser) => groupUser.userId != channel.authorId) // 跳过频道创建者
    .map((groupUser) =>
      // 使用 deleteMany 在找不到记录时也不报错
      db.channelMember.deleteMany({
        where: {
          channelId: channel.id,
          userId: groupUser.userId,
        },
      })
    )

  return Promise.all(list)
}
