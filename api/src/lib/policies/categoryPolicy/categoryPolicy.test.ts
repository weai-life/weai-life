import { create, destroy, list, update, read } from './categoryPolicy'

describe('channelPolicy', () => {
  describe('list all', () => {
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

  describe('list channel categories', () => {
    scenario('success for admin user', async (scenario) => {
      const result = list(scenario.user.admin)(scenario.category.one.channelId)
      await expect(result).resolves.toBe(true)
    })

    scenario('success for channel member user', async (scenario) => {
      const result = list(scenario.user.member)(scenario.category.one.channelId)
      await expect(result).resolves.toBe(true)
    })

    scenario(
      'failed for user who is not a channel member',
      async (scenario) => {
        const result = list(scenario.user.other)(
          scenario.category.one.channelId
        )
        await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
          `"频道成员才能访问频道分类"`
        )
      }
    )

    scenario('success for public channel', async (scenario) => {
      const result = list(scenario.user.other)(
        scenario.category.public.channelId
      )
      await expect(result).resolves.toBe(true)
    })
  })

  describe('read', () => {
    scenario('success when user is channel member', async (scenario) => {
      const result = read(scenario.user.member)(scenario.category.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.category.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = read(scenario.user.other)(scenario.category.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道成员才能访问频道分类"`
      )
    })
  })

  describe('create', () => {
    const input = {}
    scenario('success when user is admin', async (scenario) => {
      const result = create(scenario.user.admin)(input)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is manager', async (scenario) => {
      const result = create(scenario.user.manager)(input)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = create(scenario.user.member)(input)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道管理员才能创建频道分类"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.category.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is manager', async (scenario) => {
      const result = update(scenario.user.manager)(scenario.category.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.member)(scenario.category.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道管理员才能修改频道分类"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is admin', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.category.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is channel manager', async (scenario) => {
      const result = destroy(scenario.user.manager)(scenario.category.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = destroy(scenario.user.member)(scenario.category.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道管理员才能删除频道分类"`
      )
    })
  })
})
