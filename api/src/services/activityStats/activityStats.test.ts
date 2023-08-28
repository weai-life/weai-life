import { activityStats, dayAgo } from './activityStats'
import type { StandardScenario } from './activityStats.scenarios'

describe('activityStats', () => {
  scenario('returns all activityStats', async (scenario: StandardScenario) => {
    const result = await activityStats({ userId: scenario.user.one.id })

    expect(result.length).toEqual(1)
  })

  it('dateAgo', async () => {
    const now = new Date('2021-11-21')
    const date = dayAgo(now, 365)

    expect(date).toEqual('2020-11-21')
  })
})
