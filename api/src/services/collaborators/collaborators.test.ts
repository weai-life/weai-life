import type { Collaborator } from '@prisma/client'

import {
  collaborators,
  collaborator,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from './collaborators'
import type { StandardScenario } from './collaborators.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('collaborators', () => {
  scenario('returns all collaborators', async (scenario: StandardScenario) => {
    const result = await collaborators()

    expect(result.length).toEqual(Object.keys(scenario.collaborator).length)
  })

  scenario(
    'returns a single collaborator',
    async (scenario: StandardScenario) => {
      const result = await collaborator({ id: scenario.collaborator.one.id })

      expect(result).toEqual(scenario.collaborator.one)
    }
  )

  scenario('creates a collaborator', async (scenario: StandardScenario) => {
    const result = await createCollaborator({
      input: {
        postId: scenario.collaborator.two.postId,
        userId: scenario.collaborator.two.userId,
      },
    })

    expect(result.postId).toEqual(scenario.collaborator.two.postId)
    expect(result.userId).toEqual(scenario.collaborator.two.userId)
  })

  scenario('updates a collaborator', async (scenario: StandardScenario) => {
    const original = (await collaborator({
      id: scenario.collaborator.one.id,
    })) as Collaborator
    const result = await updateCollaborator({
      id: original.id,
      input: { postId: scenario.collaborator.two.postId },
    })

    expect(result.postId).toEqual(scenario.collaborator.two.postId)
  })

  scenario('deletes a collaborator', async (scenario: StandardScenario) => {
    const original = (await deleteCollaborator({
      id: scenario.collaborator.one.id,
    })) as Collaborator
    const result = await collaborator({ id: original.id })

    expect(result).toEqual(null)
  })
})
