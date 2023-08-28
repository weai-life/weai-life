/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  groups,
  publicGroups,
  group,
  createGroup,
  updateGroup,
  deleteGroup,
  pullUserToGroup,
  joinGroupByCode,
  quitGroup,
  myOwnedGroups,
  myJoinedGroups,
  joinPublicGroup,
  searchUserByMobile,
} from './groups'
import { myJoinedChannels } from './../channels/channels'

import { db } from 'src/lib/db'
import { invite } from 'src/lib/utils'

describe('groups', () => {
  scenario('returns all groups ', async (scenario) => {
    mockCurrentUser(scenario.user.admin)

    const result = await groups()

    expect(result.data.length).toEqual(3)
  })

  describe('read a group', () => {
    scenario('can read a group if joined', async (scenario) => {
      mockCurrentUser(scenario.user.member)
      const result = await group({ id: scenario.group.one.id })

      expect(result).not.toEqual(null)
    })
  })

  scenario('creates a group', async (scenario) => {
    mockCurrentUser(scenario.user.owner)
    const result = await createGroup({
      input: {
        name: 'String',
        public: true,
      },
    })

    expect(result.name).toEqual('String')
    expect(result.public).toEqual(true)
    expect(result.ownerId).toEqual(scenario.user.owner.id)

    const result2 = await db.groupUser.findUnique({
      where: {
        groupUserRelation: {
          userId: scenario.user.owner.id,
          groupId: result.id,
        },
      },
    })
    expect(result2).not.toEqual(null)
  })

  scenario('updates a group', async (scenario) => {
    mockCurrentUser(scenario.user.owner)
    const original = await db.group.findUnique({
      where: { id: scenario.group.one.id },
    })
    const result = await updateGroup({
      id: original!.id,
      input: {
        name: 'updated',
        public: true,
        avatarUrl: 'https://a.com/2.jpg',
      },
    })

    expect(result.name).toEqual('updated')
    expect(result.public).toEqual(true)
    expect(result.avatarUrl).toEqual('https://a.com/2.jpg')
  })

  scenario('delete a group', async (scenario) => {
    mockCurrentUser(scenario.user.owner)
    const original = await deleteGroup({ id: scenario.group.one.id })
    const result = await db.group.findUnique({
      where: { id: original.id },
    })

    expect(result).toEqual(null)
  })

  describe('pull user to group', () => {
    scenario('should create group user relation', async (scenario) => {
      mockCurrentUser(scenario.user.owner)
      const result = await pullUserToGroup({
        mobile: scenario.user.other.mobile,
        groupId: scenario.group.one.id,
      })

      expect(result.userId).toEqual(scenario.user.other.id)

      // confirm to join all channels of group
      const result2 = await db.channelMember.findMany({
        where: {
          userId: scenario.user.other.id,
        },
      })

      expect(result2.length).toEqual(1)
    })

    scenario('when user cannnot be found', async (scenario) => {
      mockCurrentUser(scenario.user.owner)
      const fn = () =>
        pullUserToGroup({
          mobile: 'wrongmobile',
          groupId: scenario.group.one.id,
        })

      await expect(fn).rejects.toThrowErrorMatchingInlineSnapshot(
        `"没有找到该用户"`
      )
    })
  })

  scenario('quitGroup', async (scenario) => {
    mockCurrentUser(scenario.user.member)

    await quitGroup({
      id: scenario.group.one.id,
    })

    const result = await myJoinedGroups()
    expect(result.data.length).toEqual(0)

    const result2 = await myJoinedChannels()
    expect(result2.data.length).toEqual(0)
  })

  scenario('myOwnedGroups', async (scenario) => {
    mockCurrentUser(scenario.user.owner)
    const result = await myOwnedGroups()
    expect(result.data.length).toEqual(3)
  })

  scenario('myJoinedGroups', async (scenario) => {
    mockCurrentUser(scenario.user.member)

    await pullUserToGroup({
      mobile: scenario.user.other.mobile,
      groupId: scenario.group.two.id,
    })

    mockCurrentUser(scenario.user.other)
    const result = await myJoinedGroups()
    expect(result.data.length).toEqual(1)
  })

  scenario('join a group by invite code', async (scenario) => {
    const user = scenario.user.owner
    const groupId = scenario.group.one.id
    const inviteCode = await invite.genInviteCode(user.id, groupId, {
      for: 'group',
    })

    mockCurrentUser(scenario.user.other)
    const result = await joinGroupByCode({
      inviteCode,
    })

    expect(result.userId).toEqual(scenario.user.other.id)

    // confirm to join all channels of group
    const result2 = await db.channelMember.findMany({
      where: {
        userId: scenario.user.other.id,
      },
    })

    expect(result2.length).toEqual(1)
  })
})

describe('publicGroups', () => {
  scenario('returns all public groups ', async (scenario) => {
    const result = await publicGroups()

    expect(result.data.length).toEqual(1)
  })
})

describe('joinPublicGroup', () => {
  scenario('return sucessfully when group is public', async (scenario) => {
    const user = scenario.user.other
    mockCurrentUser(user)

    const groupId = scenario.group.public.id
    const result = await joinPublicGroup({
      groupId,
    })

    expect(result.userId).toEqual(user.id)
    expect(result.groupId).toEqual(groupId)

    // create groupUser record
    const result2 = await db.groupUser.findMany({
      where: {
        userId: user.id,
      },
    })

    expect(result2.length).toEqual(1)
  })

  scenario('failed when group is not public', async (scenario) => {
    const user = scenario.user.other
    mockCurrentUser(user)

    const groupId = scenario.group.one.id
    const result = joinPublicGroup({
      groupId,
    })

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"不是公开小组无法加入"`
    )
  })
})

describe('search group user by mobile', () => {
  scenario('when user exists', async (scenario) => {
    mockCurrentUser(scenario.user.owner)

    const group = scenario.group.one
    const user = scenario.user.member

    const result = await searchUserByMobile({
      groupId: group.id,
      mobile: user.mobile,
    })
    expect(result).toEqual(user)
  })

  scenario('when user not exists', async (scenario) => {
    mockCurrentUser(scenario.user.owner)

    const group = scenario.group.one

    const result = await searchUserByMobile({
      groupId: group.id,
      mobile: 'phone not exist',
    })
    expect(result).toEqual(null)
  })
})
