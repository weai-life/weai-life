/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { invite } from 'src/lib/utils'
import { genInviteCode, genInviteCodeForGroup, getInviteInfo } from './invite'

describe('Invite Code', () => {
  scenario('生成频道邀请码', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await genInviteCode({ channelId: scenario.channel.one.id })
    expect(result).not.toEqual(null)

    const [userId, id, option] = await invite.getDataByInviteCode(result.code)
    expect(userId).toEqual(scenario.user.one.id)
    expect(id).toEqual(scenario.channel.one.id)
    expect(option.for).toEqual('channel')
  })

  scenario('生成小组邀请码', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await genInviteCodeForGroup({
      groupId: scenario.group.one.id,
    })
    expect(result).not.toEqual(null)

    const [userId, id, option] = await invite.getDataByInviteCode(result.code)
    expect(userId).toEqual(scenario.user.one.id)
    expect(id).toEqual(scenario.group.one.id)
    expect(option.for).toEqual('group')
  })

  scenario('获取频道邀请码信息', async (scenario) => {
    const code = await invite.genInviteCode(
      scenario.user.one.id,
      scenario.channel.one.id,
      { for: 'channel' }
    )

    const result = await getInviteInfo({ inviteCode: code })

    expect(result.inviter.id).toEqual(scenario.user.one.id)
    expect(result.channel.id).toEqual(scenario.channel.one.id)
  })

  scenario('获取小组邀请码信息', async (scenario) => {
    const code = await invite.genInviteCode(
      scenario.user.one.id,
      scenario.group.one.id,
      { for: 'group' }
    )

    const result = await getInviteInfo({ inviteCode: code })

    expect(result.inviter.id).toEqual(scenario.user.one.id)
    expect(result.group.id).toEqual(scenario.group.one.id)
  })
})
