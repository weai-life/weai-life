import {
  permissions,
  permission,
  createPermission,
  updatePermission,
  deletePermission,
} from './permissions'
import type { StandardScenario } from './permissions.scenarios'

describe('permissions', () => {
  scenario('returns all permissions', async (scenario: StandardScenario) => {
    const result = await permissions()

    expect(result.length).toEqual(Object.keys(scenario.permission).length)
  })

  scenario(
    'returns a single permission',
    async (scenario: StandardScenario) => {
      const result = await permission({ id: scenario.permission.one.id })

      expect(result).toEqual(scenario.permission.one)
    }
  )

  scenario('creates a permission', async () => {
    const result = await createPermission({
      input: {
        description: '2022-01-02T14:17:54Z',
        key: 'create',
        name: 'String',
      },
    })

    expect(result.description).toEqual('2022-01-02T14:17:54Z')
    expect(result.name).toEqual('String')
  })

  scenario('updates a permission', async (scenario: StandardScenario) => {
    const original = await permission({ id: scenario.permission.one.id })
    const result = await updatePermission({
      id: original.id,
      input: { description: '2022-01-03T14:17:54Z' },
    })

    expect(result.description).toEqual('2022-01-03T14:17:54Z')
  })

  scenario('deletes a permission', async (scenario: StandardScenario) => {
    const original = await deletePermission({ id: scenario.permission.one.id })
    const result = await permission({ id: original.id })

    expect(result).toEqual(null)
  })
})
