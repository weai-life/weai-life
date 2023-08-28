import { getBlockUser } from 'src/lib/utils/dbHelper'
import {
  blockUsers,
  blockUser,
  createBlockUser,
  updateBlockUser,
  deleteBlockUser,
  myBlockUsers,
} from './blockUsers'
import type { StandardScenario } from './blockUsers.scenarios'

describe('blockUsers', () => {
  scenario('returns all blockUsers', async (scenario: StandardScenario) => {
    const result = await blockUsers()

    expect(result.data.length).toEqual(Object.keys(scenario.blockUser).length)
  })

  scenario('returns my blockUsers', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.owner)
    const result = await myBlockUsers()

    expect(result.data.length).toEqual(Object.keys(scenario.blockUser).length)
  })

  scenario('returns a single blockUser', async (scenario: StandardScenario) => {
    const result = await blockUser({ id: scenario.blockUser.one.id })

    expect(result).toEqual(scenario.blockUser.one)
  })

  scenario('creates a blockUser', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.owner)

    const result = await createBlockUser({
      input: {
        updatedAt: '2021-11-18T01:59:53Z',
        blockedUserId: scenario.user.other.id,
      },
    })

    expect(result.userId).toEqual(scenario.user.owner.id)
    expect(result.blockedUserId).toEqual(scenario.user.other.id)
  })

  scenario('updates a blockUser', async (scenario: StandardScenario) => {
    const original = await blockUser({ id: scenario.blockUser.one.id })
    const result = await updateBlockUser({
      id: original.id,
      input: { blockedUserId: scenario.user.other.id },
    })

    expect(result.blockedUserId).toEqual(scenario.user.other.id)
  })

  scenario('deletes a blockUser', async (scenario: StandardScenario) => {
    const original = await deleteBlockUser({ id: scenario.blockUser.one.id })
    const result = await getBlockUser(original.id)

    expect(result).toEqual(null)
  })
})
