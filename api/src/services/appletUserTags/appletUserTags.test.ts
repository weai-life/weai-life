import type { AppletUserTag } from '@prisma/client'

import {
  appletUserTags,
  appletUserTag,
  createAppletUserTag,
  updateAppletUserTag,
  deleteAppletUserTag,
} from './appletUserTags'
import type { StandardScenario } from './appletUserTags.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('appletUserTags', () => {
  scenario('returns all appletUserTags', async (scenario: StandardScenario) => {
    const result = await appletUserTags()

    expect(result.length).toEqual(Object.keys(scenario.appletUserTag).length)
  })

  scenario(
    'returns a single appletUserTag',
    async (scenario: StandardScenario) => {
      const result = await appletUserTag({ id: scenario.appletUserTag.one.id })

      expect(result).toEqual(scenario.appletUserTag.one)
    }
  )

  scenario('creates a appletUserTag', async (scenario: StandardScenario) => {
    const result = await createAppletUserTag({
      input: {
        appletUserId: scenario.appletUserTag.two.appletUserId,
        tagId: scenario.appletUserTag.two.tagId,
      },
    })

    expect(result.appletUserId).toEqual(scenario.appletUserTag.two.appletUserId)
    expect(result.tagId).toEqual(scenario.appletUserTag.two.tagId)
  })

  scenario('updates a appletUserTag', async (scenario: StandardScenario) => {
    const original = (await appletUserTag({
      id: scenario.appletUserTag.one.id,
    })) as AppletUserTag
    const result = await updateAppletUserTag({
      id: original.id,
      input: { appletUserId: scenario.appletUserTag.two.appletUserId },
    })

    expect(result.appletUserId).toEqual(scenario.appletUserTag.two.appletUserId)
  })

  scenario('deletes a appletUserTag', async (scenario: StandardScenario) => {
    const original = (await deleteAppletUserTag({
      id: scenario.appletUserTag.one.id,
    })) as AppletUserTag
    const result = await appletUserTag({ id: original.id })

    expect(result).toEqual(null)
  })
})
