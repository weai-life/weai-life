import type { ToolUser } from '@prisma/client'

import {
  toolUsers,
  toolUser,
  createToolUser,
  updateToolUser,
  deleteToolUser,
} from './toolUsers'
import type { StandardScenario } from './toolUsers.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('toolUsers', () => {
  scenario('returns all toolUsers', async (scenario: StandardScenario) => {
    const result = await toolUsers()

    expect(result.length).toEqual(Object.keys(scenario.toolUser).length)
  })

  scenario('returns a single toolUser', async (scenario: StandardScenario) => {
    const result = await toolUser({ id: scenario.toolUser.one.id })

    expect(result).toEqual(scenario.toolUser.one)
  })

  scenario('creates a toolUser', async () => {
    const result = await createToolUser({
      input: { updatedAt: '2023-12-06T01:21:04.674Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-06T01:21:04.674Z'))
  })

  scenario('updates a toolUser', async (scenario: StandardScenario) => {
    const original = (await toolUser({
      id: scenario.toolUser.one.id,
    })) as ToolUser
    const result = await updateToolUser({
      id: original.id,
      input: { updatedAt: '2023-12-07T01:21:04.674Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-07T01:21:04.674Z'))
  })

  scenario('deletes a toolUser', async (scenario: StandardScenario) => {
    const original = (await deleteToolUser({
      id: scenario.toolUser.one.id,
    })) as ToolUser
    const result = await toolUser({ id: original.id })

    expect(result).toEqual(null)
  })
})
