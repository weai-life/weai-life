import { getCurrentUser } from 'src/lib/context'
import { invite } from 'src/lib/utils'
import { db } from 'src/lib/db'
import { authorize, ChannelPolicy, GroupPolicy } from 'src/lib/policies'

export async function genInviteCode({ channelId }) {
  const channel = await db.channel.findUnique({ where: { id: channelId } })
  await authorize(ChannelPolicy.inviteUser)(channel)

  const code = await invite.genInviteCode(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getCurrentUser().id,
    channelId,
    { for: 'channel' }
  )

  return { code }
}

export async function genInviteCodeForGroup({ groupId }) {
  const group = await db.group.findUnique({ where: { id: groupId } })
  await authorize(GroupPolicy.inviteUser)(group)

  const code = await invite.genInviteCode(getCurrentUser().id, groupId, {
    for: 'group',
  })

  return { code }
}

export async function getInviteInfo({ inviteCode }) {
  const [userId, id, option] = await invite.getDataByInviteCode(inviteCode)

  const inviter = await db.user.findUnique({ where: { id: userId } })

  const channel =
    option.for === 'channel' && (await db.channel.findUnique({ where: { id } }))

  const group =
    option.for === 'group' && (await db.group.findUnique({ where: { id } }))

  return {
    channel,
    group,
    inviter,
  }
}
