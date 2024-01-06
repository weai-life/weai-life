import type { ToolUserTag } from '@prisma/client'

import {
  toolUserTags,
  toolUserTag,
  createToolUserTag,
  updateToolUserTag,
  deleteToolUserTag,
} from './toolUserTags'
import type { StandardScenario } from './toolUserTags.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('toolUserTags', () => {
  scenario('returns all toolUserTags', async (scenario: StandardScenario) => {
    const result = await toolUserTags()

    expect(result.length).toEqual(Object.keys(scenario.toolUserTag).length)
  })

  scenario(
    'returns a single toolUserTag',
    async (scenario: StandardScenario) => {
      const result = await toolUserTag({ id: scenario.toolUserTag.one.id })

      expect(result).toEqual(scenario.toolUserTag.one)
    }
  )

  scenario('creates a toolUserTag', async (scenario: StandardScenario) => {
    const result = await createToolUserTag({
      input: {
        toolUserId: scenario.toolUserTag.two.toolUserId,
        tagId: scenario.toolUserTag.two.tagId,
      },
    })

    expect(result.toolUserId).toEqual(scenario.toolUserTag.two.toolUserId)
    expect(result.tagId).toEqual(scenario.toolUserTag.two.tagId)
  })

  scenario('updates a toolUserTag', async (scenario: StandardScenario) => {
    const original = (await toolUserTag({
      id: scenario.toolUserTag.one.id,
    })) as ToolUserTag
    const result = await updateToolUserTag({
      id: original.id,
      input: { toolUserId: scenario.toolUserTag.two.toolUserId },
    })

    expect(result.toolUserId).toEqual(scenario.toolUserTag.two.toolUserId)
  })

  scenario('deletes a toolUserTag', async (scenario: StandardScenario) => {
    const original = (await deleteToolUserTag({
      id: scenario.toolUserTag.one.id,
    })) as ToolUserTag
    const result = await toolUserTag({ id: original.id })

    expect(result).toEqual(null)
  })
})
