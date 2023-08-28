import { create, destroy, list, update, read, mine } from './blockPolicy'

describe('blockPolicy', () => {
  describe('list', () => {
    scenario('success for admin user', async (scenario) => {
      const result = list(scenario.user.admin)()
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for not admin user', async (scenario) => {
      const result = list(scenario.user.other)()
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您无权访问"`
      )
    })
  })

  describe('mine', () => {
    scenario('success for admin user', async (scenario) => {
      const result = mine(scenario.user.other)()
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for not admin user', async (scenario) => {
      const result = mine()()
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您尚未登录"`
      )
    })
  })

  describe('read', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = read(scenario.user.owner)(scenario.block.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.block.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = read(scenario.user.other)(scenario.block.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"所有者才能访问"`
      )
    })
  })

  describe('create', () => {
    const input = {}
    scenario('success when user is logged in', async (scenario) => {
      const result = create(scenario.user.owner)(input)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is not logged in', async (scenario) => {
      const result = create()(input)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您尚未登录"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = update(scenario.user.owner)(scenario.block.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.other)(scenario.block.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"所有者才能更新"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.block.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = destroy(scenario.user.other)(scenario.block.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"所有者才能删除"`
      )
    })
  })
})
