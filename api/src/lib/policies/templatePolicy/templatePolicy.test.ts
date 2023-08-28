import { create, destroy, update } from './templatePolicy'

describe('templatePolicy', () => {
  describe('create', () => {
    scenario('success when user is logged in', async (scenario) => {
      const result = create(scenario.user.owner)()
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is not logged in', async (scenario) => {
      const result = create(null)()
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您尚未登录"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = update(scenario.user.owner)(scenario.template.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.template.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.other)(scenario.template.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能修改"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.template.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.template.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = destroy(scenario.user.other)(scenario.template.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能删除"`
      )
    })
  })
})
