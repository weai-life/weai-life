import { create, destroy, list, update } from './pagePolicy'

describe('pagePolicy', () => {
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

  describe('create', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = create(scenario.user.owner)(scenario.page.one.channelId)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = create(scenario.user.admin)(scenario.page.one.channelId)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is group owner', async (scenario) => {
      const result = create(scenario.user.groupOwner)(
        scenario.page.one.channelId
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user has create role', async (scenario) => {
      const result = create(scenario.user.createPage)(
        scenario.page.one.channelId
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = create(scenario.user.other)(scenario.page.one.channelId)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您无权生成页面"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = update(scenario.user.owner)(scenario.page.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.page.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is group owner', async (scenario) => {
      const result = update(scenario.user.groupOwner)(scenario.page.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user has update role', async (scenario) => {
      const result = update(scenario.user.updatePage)(scenario.page.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.other)(scenario.page.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您无权修改页面"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.page.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.page.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is group owner', async (scenario) => {
      const result = destroy(scenario.user.groupOwner)(scenario.page.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user has delete role', async (scenario) => {
      const result = destroy(scenario.user.deletePage)(scenario.page.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = destroy(scenario.user.other)(scenario.page.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您无权删除页面"`
      )
    })
  })
})
