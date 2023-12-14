/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { db } from 'src/lib/db'
import { getChannelMember } from 'src/lib/utils/dbHelper'

import {
  publicChannels,
  channels,
  channel,
  createChannel,
  updateChannel,
  deleteChannel,
  pullUserToChannel,
  myOwnedChannels,
  myJoinedChannels,
  clearUnreadPostCount,
  transferChannel,
  Channel,
} from './channels'
import { removeGroupUsersFromChannel } from './lib/removeGroupUsersFromChannel'

jest.mock('./lib/removeGroupUsersFromChannel', () => ({
  removeGroupUsersFromChannel: jest.fn(),
}))

describe('channels', () => {
  scenario('returns all channels when user is admin', async (scenario) => {
    mockCurrentUser(scenario.user.admin)

    const result = await channels()

    expect(result.data.length).toEqual(
      Object.keys(scenario.channel).length +
        Object.keys(scenario.channelMember).length
    )
  })

  scenario(
    'returns all public channels even if user is not logged in',
    async (_scenario) => {
      const result = await publicChannels()

      expect(result.data.length).toEqual(1)
    }
  )

  describe('read a channel', () => {
    scenario('when the channel is public', async (scenario) => {
      const result = await channel({ id: scenario.channel.two.id })

      expect(result).toEqual(scenario.channel.two)
    })

    scenario('可以访问加入中的频道', async (scenario) => {
      const user = await db.user.findUnique({
        where: {
          id: scenario.channelMember.one.userId,
        },
      })
      mockCurrentUser(user)
      const result = await channel({ id: scenario.channelMember.one.channelId })

      expect(result).not.toEqual(null)
    })
  })

  scenario('creates a channel', async (scenario) => {
    mockCurrentUser(scenario.user.owner)
    const result = await createChannel({
      input: {
        name: 'String',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.authorId).toEqual(scenario.user.owner.id)

    const result2 = await db.channelMember.findUnique({
      where: {
        membership: { userId: scenario.user.owner.id, channelId: result.id },
      },
    })
    expect(result2).not.toEqual(null)
    expect(result2!.isAdmin).toEqual(true)
  })

  describe('update a channel', () => {
    scenario('without groupId', async (scenario) => {
      mockCurrentUser(scenario.user.owner)
      const original = await db.channel.findUnique({
        where: { id: scenario.channel.one.id },
      })
      const result = await updateChannel({
        id: original!.id,
        input: { name: 'updated', avatarUrl: 'https://a.com/2.jpg' },
      })

      expect(result.name).toEqual('updated')
      expect(result.avatarUrl).toEqual('https://a.com/2.jpg')
      expect(removeGroupUsersFromChannel).not.toHaveBeenCalled()
    })

    scenario('with groupId', async (scenario) => {
      mockCurrentUser(scenario.user.owner)
      const original = scenario.channel.two

      const _channel = await updateChannel({
        id: original!.id,
        input: { groupId: null },
      })

      expect(removeGroupUsersFromChannel).toHaveBeenCalledWith(
        original.groupId,
        original
      )
    })
  })

  scenario('deletes a channel', async (scenario) => {
    mockCurrentUser(scenario.user.owner)
    const original = await deleteChannel({ id: scenario.channel.one.id })
    const result = await db.channel.findUnique({
      where: { id: original.id },
    })

    expect(result).toEqual(null)

    const page = await db.page.findFirst({
      where: { channelId: original.id },
    })
    expect(page).toEqual(null)
  })

  describe('pull user to channel', () => {
    scenario('should create membership', async (scenario) => {
      mockCurrentUser(scenario.user.owner)
      const result = await pullUserToChannel({
        mobile: scenario.user.other.mobile,
        channelId: scenario.channel.one.id,
      })

      expect(result.userId).toEqual(scenario.user.other.id)
    })

    scenario('when user cannnot be found', async (scenario) => {
      mockCurrentUser(scenario.user.owner)
      const fn = () =>
        pullUserToChannel({
          mobile: 'wrongmobile',
          channelId: scenario.channel.one.id,
        })

      await expect(fn).rejects.toThrowErrorMatchingInlineSnapshot(
        `"没有找到该用户"`
      )
    })
  })

  scenario('myOwnedChannels', async (scenario) => {
    mockCurrentUser(scenario.user.owner)
    const result = await myOwnedChannels()
    expect(result.data.length).toEqual(1)
  })

  scenario('myJoinedChannels', async (scenario) => {
    mockCurrentUser(scenario.user.owner)

    await pullUserToChannel({
      mobile: scenario.user.other.mobile,
      channelId: scenario.channel.one.id,
    })

    mockCurrentUser(scenario.user.other)
    const result = await myJoinedChannels()
    expect(result.data.length).toEqual(1)
  })

  scenario('clearUnreadPostCount', async (scenario) => {
    mockCurrentUser(scenario.user.owner)

    await clearUnreadPostCount({
      channelId: scenario.channelMember.one.channelId,
    })

    const result = await db.channelMember.findUnique({
      where: { id: scenario.channelMember.one.id },
    })

    expect(result!.unreadPostCount).toEqual(0)
  })

  scenario(
    'clearUnreadPostCount throw error when user not in member',
    async (scenario) => {
      mockCurrentUser(scenario.user.owner)

      const result = clearUnreadPostCount({
        channelId: scenario.channel.one.id,
      })

      expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"不在频道成员内"`
      )
    }
  )

  scenario('transfer channel', async (scenario) => {
    const testChannel = scenario.channel.one
    const testUser = scenario.user.other

    const channel = await transferChannel({
      channelId: testChannel.id,
      userId: testUser.id,
    })

    expect(channel!.authorId).toEqual(testUser.id)

    const member = await getChannelMember(channel!.id, testUser.id)
    expect(member).not.toBe(null)
    expect(member?.isAdmin).toBe(true)
    expect(member?.status).toBe('JOINED')
  })
})

describe('channel with group', () => {
  scenario('creates a channel', async (scenario) => {
    mockCurrentUser(scenario.user.owner)

    const groupId = scenario.group.one.id
    const channel = await createChannel({
      input: {
        name: 'String',
        groupId,
      },
    })

    expect(channel.groupId).toEqual(groupId)

    const result = await db.channelMember.findFirst({
      where: {
        userId: scenario.user.groupUser.id,
        channelId: channel.id,
        status: 'JOINED',
      },
    })
    expect(result).not.toEqual(null)
  })

  scenario('设置 groupId 后所有成员加入到频道中', async (scenario) => {
    mockCurrentUser(scenario.user.owner)

    const groupId = scenario.group.one.id
    const original = await db.channel.findUnique({
      where: { id: scenario.channel.one.id },
    })
    const channel = await updateChannel({
      id: original!.id,
      input: { groupId },
    })

    // 确认小组成员成为了频道成员
    const result = await db.channelMember.findFirst({
      where: {
        userId: scenario.user.groupUser.id,
        channelId: channel.id,
        status: 'JOINED',
      },
    })
    expect(result).not.toEqual(null)
  })
})

describe('isChannelMember', () => {
  scenario('when current user is channel member', async (scenario) => {
    mockCurrentUser(scenario.user.owner)

    const channelId = scenario.channelMember.one.channelId
    const target = await channel({ id: channelId })

    const result = await Channel.isChannelMember(null, { root: target })
    expect(result).toEqual(true)
  })

  scenario('when current user is not channel member', async (scenario) => {
    mockCurrentUser(scenario.user.other)

    const channelId = scenario.channelMember.one.channelId
    const target = await channel({ id: channelId })

    const result = await Channel.isChannelMember(null, { root: target })
    expect(result).toEqual(false)
  })
})
