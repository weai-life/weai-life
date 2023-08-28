/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  channelMembers,
  channelMember,
  createChannelMember,
  updateChannelMember,
  deleteChannelMember,
  joinChannel,
  joinChannelByCode,
  quitChannel,
} from './channelMembers'

import { invite } from 'src/lib/utils'

describe('channelMembers', () => {
  scenario('returns all channelMembers', async (scenario) => {
    const result = await channelMembers()

    expect(result.data.length).toEqual(
      Object.keys(scenario.channelMember).length
    )
  })

  scenario('returns a single channelMember', async (scenario) => {
    const result = await channelMember({ id: scenario.channelMember.one.id })

    expect(result).toEqual(scenario.channelMember.one)
  })

  scenario('creates a channelMember', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await createChannelMember({
      input: {
        status: 'PENDING',
        channelId: scenario.channelMember.two.channelId,
        userId: scenario.user.one.id,
      },
    })

    expect(result.status).toEqual('PENDING')
    expect(result.channelId).toEqual(scenario.channelMember.two.channelId)
    expect(result.userId).toEqual(scenario.user.one.id)
  })

  scenario('updates a channelMember', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const original = await channelMember({ id: scenario.channelMember.one.id })
    const result = await updateChannelMember({
      id: original!.id,
      input: { status: 'JOINED' },
    })

    expect(result.status).toEqual('JOINED')
  })

  scenario('deletes a channelMember', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const original = await deleteChannelMember({
      id: scenario.channelMember.one.id,
    })
    const result = await channelMember({ id: original.id })

    expect(result).toEqual(null)
  })

  scenario('join a channel', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await joinChannel({
      id: scenario.channelMember.one.channelId,
    })
    expect(result.userId).toEqual(scenario.user.one.id)
  })

  scenario('join a channel by invite code', async (scenario) => {
    const user = scenario.user.one
    const channelId = scenario.channelMember.one.channelId
    const inviteCode = await invite.genInviteCode(user.id, channelId)

    mockCurrentUser(scenario.user.one)
    const result = await joinChannelByCode({
      inviteCode,
    })

    expect(result.userId).toEqual(user.id)
  })

  scenario('quit a channel', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const original = await quitChannel({
      id: scenario.channelMember.three.channelId,
    })

    const result = await channelMember({ id: original.id })
    expect(result).toEqual(null)
  })
})
