import { destroy, list, read, update } from './blockUserPolicy'

describe('blockUserPolicy', () => {
  describe('list', () => {
    scenario('success for admin user', async (scenario) => {
      const result = list(scenario.user.admin)()
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for not admin user', async (scenario) => {
      const result = list(scenario.user.owner)()
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您无权访问"`
      )
    })
  })

  describe('read', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = read(scenario.user.owner)(scenario.blockUser.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.blockUser.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = read(scenario.user.other)(scenario.blockUser.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能访问"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = update(scenario.user.owner)(scenario.blockUser.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.blockUser.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.other)(scenario.blockUser.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能修改"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.blockUser.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.blockUser.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = destroy(scenario.user.other)(scenario.blockUser.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能删除"`
      )
    })
  })
})
