/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  groupApplications,
  myGroupApplications,
  groupApplication,
  applyToJoinGroup,
  rejectGroupApplication,
  approveGroupApplication,
} from './groupApplications'
import type { StandardScenario } from './groupApplications.scenarios'
import { db } from 'src/lib/db'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('groupApplications', () => {
  scenario(
    'returns all groupApplications for a group',
    async (scenario: StandardScenario) => {
      const where = { groupId: scenario.groupApplication.one.groupId! }
      const result = await groupApplications({ where })

      expect(result.data.length).toEqual(1)
    }
  )

  scenario(
    'returns my groupApplications',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.other)

      const result = await myGroupApplications()

      expect(result.data.length).toEqual(2)
    }
  )

  scenario(
    'returns a single groupApplication',
    async (scenario: StandardScenario) => {
      const result = await groupApplication({
        id: scenario.groupApplication.one.id,
      })

      expect(result).toEqual(scenario.groupApplication.one)
    }
  )

  scenario('applyToJoinGroup', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.other)

    const groupId = scenario.groupApplication.two.groupId as number

    const result = await applyToJoinGroup({
      input: {
        groupId,
        content: 'String',
      },
    })

    expect(result.groupId).toEqual(scenario.groupApplication.two.groupId)
    expect(result.userId).toEqual(scenario.user.other.id)
    expect(result.content).toEqual('String')
  })

  scenario('reject a groupApplication', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.owner)

    const original = await groupApplication({
      id: scenario.groupApplication.one.id,
    })
    const result = await rejectGroupApplication({
      id: original!.id,
      input: { rejectReason: 'String2' },
    })

    expect(result.rejectReason).toEqual('String2')
    expect(result.status).toEqual('REJECTED')
    expect(result.reviewUserId).toEqual(scenario.user.owner.id)
  })

  scenario('approve a groupApplication', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.owner)

    const original = await groupApplication({
      id: scenario.groupApplication.one.id,
    })

    const result = await approveGroupApplication({
      id: original!.id,
    })

    const count = await db.groupUser.count({
      where: { groupId: original?.groupId },
    })

    expect(result.status).toEqual('APPROVED')

    expect(count).toEqual(1)
  })
})
