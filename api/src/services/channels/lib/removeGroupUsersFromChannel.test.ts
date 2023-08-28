/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { db } from 'src/lib/db'
import { removeGroupUsersFromChannel } from './removeGroupUsersFromChannel'

describe('removeGroupUsersFromChannel', () => {
  scenario('小组成员将退出频道', async (scenario) => {
    const getMember = (userId) =>
      db.channelMember.findFirst({
        where: {
          userId,
          channelId: scenario.channel.one.id,
          status: 'JOINED',
        },
      })

    expect(getMember(scenario.user.member.id)).resolves.not.toEqual(null)

    await removeGroupUsersFromChannel(
      scenario.channel.one.groupId,
      scenario.channel.one
    )

    // 成员将被删除
    expect(getMember(scenario.user.member.id)).resolves.toEqual(null)

    // 频道创建者被保留
    expect(getMember(scenario.user.owner.id)).resolves.not.toEqual(null)
  })
})
