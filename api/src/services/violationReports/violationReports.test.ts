import {
  violationReports,
  violationReport,
  createViolationReport,
  updateViolationReport,
  deleteViolationReport,
} from './violationReports'
import type { StandardScenario } from './violationReports.scenarios'

describe('violationReports', () => {
  scenario(
    'returns all violationReports',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.admin)

      const result = await violationReports()

      expect(result.data.length).toEqual(
        Object.keys(scenario.violationReport).length
      )
    }
  )

  scenario(
    'returns a single violationReport',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.admin)

      const result = await violationReport({
        id: scenario.violationReport.one.id,
      })

      expect(result).toEqual(scenario.violationReport.one)
    }
  )

  scenario('creates a violationReport', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await createViolationReport({
      input: {
        content: '2021-11-01T14:16:03Z',
        violationCategoryId: scenario.violationReport.two.violationCategoryId,
        postId: scenario.violationReport.two.postId,
      },
    })

    expect(result.content).toEqual('2021-11-01T14:16:03Z')
    expect(result.reporterId).toEqual(scenario.user.one.id)
    expect(result.violationCategoryId).toEqual(
      scenario.violationReport.two.violationCategoryId
    )
    expect(result.postId).toEqual(scenario.violationReport.two.postId)
  })

  scenario('updates a violationReport', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.admin)

    const original = await violationReport({
      id: scenario.violationReport.one.id,
    })
    const result = await updateViolationReport({
      id: original.id,
      input: { content: '2021-11-02T14:16:03Z' },
    })

    expect(result.content).toEqual('2021-11-02T14:16:03Z')
  })

  scenario('deletes a violationReport', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.admin)

    const original = await deleteViolationReport({
      id: scenario.violationReport.one.id,
    })
    const result = await violationReport({ id: original.id })

    expect(result).toEqual(null)
  })
})
