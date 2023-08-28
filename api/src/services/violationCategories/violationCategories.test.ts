import {
  violationCategories,
  violationCategory,
  createViolationCategory,
  updateViolationCategory,
  deleteViolationCategory,
} from './violationCategories'
import type { StandardScenario } from './violationCategories.scenarios'

describe('violationCategories', () => {
  scenario(
    'returns all violationCategories',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)

      const result = await violationCategories()

      expect(result.length).toEqual(
        Object.keys(scenario.violationCategory).length
      )
    }
  )

  scenario(
    'returns a single violationCategory',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)

      const result = await violationCategory({
        id: scenario.violationCategory.one.id,
      })

      expect(result).toEqual(scenario.violationCategory.one)
    }
  )

  scenario(
    'creates a violationCategory',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.two)

      const result = await createViolationCategory({
        input: { name: 'String' },
      })

      expect(result.name).toEqual('String')
    }
  )

  scenario(
    'updates a violationCategory',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.two)

      const original = await violationCategory({
        id: scenario.violationCategory.one.id,
      })
      const result = await updateViolationCategory({
        id: original.id,
        input: { name: 'updated' },
      })

      expect(result.name).toEqual('updated')
    }
  )

  scenario(
    'deletes a violationCategory',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.two)

      const original = await deleteViolationCategory({
        id: scenario.violationCategory.one.id,
      })
      const result = await violationCategory({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
