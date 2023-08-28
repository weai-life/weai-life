import { list, update, read, accessPrivate } from './userPolicy'

describe('userPolicy', () => {
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

  describe('read', () => {
    scenario('success when user is himself', async (scenario) => {
      const result = read(scenario.user.one)(scenario.user.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.user.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = read(scenario.user.other)(scenario.user.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权访问用户信息"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is himself', async (scenario) => {
      const result = update(scenario.user.one)(scenario.user.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.user.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.other)(scenario.user.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"只能修改自己的信息"`
      )
    })
  })

  describe('accessPrivate', () => {
    scenario('success when user is himself', async (scenario) => {
      const result = accessPrivate(scenario.user.one)(scenario.user.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = accessPrivate(scenario.user.admin)(scenario.user.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = accessPrivate(scenario.user.other)(scenario.user.one)
      await expect(result).resolves.toBe(false)
    })
  })
})
