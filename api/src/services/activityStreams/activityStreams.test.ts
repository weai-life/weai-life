/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  myActivityStreams,
  activityStreams,
  activityStream,
  createActivityStream,
  updateActivityStream,
  deleteActivityStream,
} from './activityStreams'
import { db } from 'src/lib/db'
import type { StandardScenario } from './activityStreams.scenarios'

describe('activityStreams', () => {
  scenario('returns my activityStreams', async (scenario: StandardScenario) => {
    const user = await db.user.findUnique({
      where: {
        id: scenario.activityStream.one.userId,
      },
    })
    mockCurrentUser(user)
    const result = await myActivityStreams()

    expect(result.data.length).toEqual(1)
  })

  scenario(
    'returns all activityStreams',
    async (scenario: StandardScenario) => {
      const result = await activityStreams()

      expect(result.length).toEqual(Object.keys(scenario.activityStream).length)
    }
  )

  scenario(
    'returns a single activityStream',
    async (scenario: StandardScenario) => {
      const result = await activityStream({
        id: scenario.activityStream.one.id,
      })

      expect(result).toEqual(scenario.activityStream.one)
    }
  )

  scenario('creates a activityStream', async (scenario: StandardScenario) => {
    const result = await createActivityStream({
      input: {
        userId: scenario.activityStream.two.userId!,
        data: { foo: 'bar' },
      },
    })

    expect(result.userId).toEqual(scenario.activityStream.two.userId)
    expect(result.data).toEqual({ foo: 'bar' })
  })

  scenario('updates a activityStream', async (scenario: StandardScenario) => {
    const original = await activityStream({
      id: scenario.activityStream.one.id,
    })
    const result = await updateActivityStream({
      id: original!.id,
      input: { data: { foo: 'foo' } },
    })

    expect(result.data).toEqual({ foo: 'foo' })
  })

  scenario('deletes a activityStream', async (scenario: StandardScenario) => {
    const original = await deleteActivityStream({
      id: scenario.activityStream.one.id,
    })
    const result = await activityStream({ id: original.id })

    expect(result).toEqual(null)
  })
})
