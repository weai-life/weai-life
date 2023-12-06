import type { AppletUser } from '@prisma/client'

import {
  appletUsers,
  appletUser,
  createAppletUser,
  updateAppletUser,
  deleteAppletUser,
} from './appletUsers'
import type { StandardScenario } from './appletUsers.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('appletUsers', () => {
  scenario('returns all appletUsers', async (scenario: StandardScenario) => {
    const result = await appletUsers()

    expect(result.length).toEqual(Object.keys(scenario.appletUser).length)
  })

  scenario(
    'returns a single appletUser',
    async (scenario: StandardScenario) => {
      const result = await appletUser({ id: scenario.appletUser.one.id })

      expect(result).toEqual(scenario.appletUser.one)
    }
  )

  scenario('creates a appletUser', async () => {
    const result = await createAppletUser({
      input: { updatedAt: '2023-12-06T01:21:04.674Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-06T01:21:04.674Z'))
  })

  scenario('updates a appletUser', async (scenario: StandardScenario) => {
    const original = (await appletUser({
      id: scenario.appletUser.one.id,
    })) as AppletUser
    const result = await updateAppletUser({
      id: original.id,
      input: { updatedAt: '2023-12-07T01:21:04.674Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-07T01:21:04.674Z'))
  })

  scenario('deletes a appletUser', async (scenario: StandardScenario) => {
    const original = (await deleteAppletUser({
      id: scenario.appletUser.one.id,
    })) as AppletUser
    const result = await appletUser({ id: original.id })

    expect(result).toEqual(null)
  })
})
