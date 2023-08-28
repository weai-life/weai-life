/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { db } from 'src/lib/db'
import {
  groupUsers,
  groupUser,
  updateGroupUser,
  deleteGroupUser,
  clearGroupUnreadPostCount,
} from './groupUsers'

describe('groupUsers', () => {
  scenario('returns all groupUsers when user is admin', async (scenario) => {
    mockCurrentUser(scenario.user.admin)

    const result = await groupUsers()

    expect(result.data.length).toEqual(Object.keys(scenario.groupUser).length)
  })

  scenario('returns a single groupUser', async (scenario) => {
    mockCurrentUser(scenario.user.member)
    const result = await groupUser({ id: scenario.groupUser.member.id })

    expect(result).toEqual(scenario.groupUser.member)
  })

  scenario('updates a groupUser', async (scenario) => {
    mockCurrentUser(scenario.user.member)
    const original = await db.groupUser.findUnique({
      where: { id: scenario.groupUser.member.id },
    })
    const result = await updateGroupUser({
      id: original!.id,
      input: { status: 'JOINED' },
    })

    expect(result.status).toEqual('JOINED')
  })

  scenario('delete a groupUser', async (scenario) => {
    mockCurrentUser(scenario.user.owner)
    const original = await deleteGroupUser({ id: scenario.groupUser.member.id })
    const result = await db.groupUser.findUnique({
      where: { id: original.id },
    })

    expect(result).toEqual(null)
  })

  scenario('clearGroupUnreadPostCount', async (scenario) => {
    mockCurrentUser(scenario.user.member)

    await clearGroupUnreadPostCount({
      groupId: scenario.groupUser.member.groupId,
    })

    const result = await db.groupUser.findUnique({
      where: { id: scenario.groupUser.member.id },
    })

    expect(result!.unreadPostCount).toEqual(0)
  })
})
