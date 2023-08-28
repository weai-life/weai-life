import { list, read, create, update, destroy } from './groupUserPolicy'

describe('groupPolicy', () => {
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
    scenario('success when user is admin', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.groupUser.member)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when channel is member', async (scenario) => {
      const result = read(scenario.user.member)(scenario.groupUser.member)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = read(scenario.user.other)(scenario.groupUser.member)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"组成员才可以访问"`
      )
    })
  })

  describe('create', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = create(scenario.user.owner)(
        scenario.groupUser.owner.groupId
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user is member', async (scenario) => {
      const result = create(scenario.user.member)(
        scenario.groupUser.owner.groupId
      )
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"组管理员才能加新成员"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = update(scenario.user.owner)(scenario.groupUser.member)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.groupUser.member)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.member)(scenario.groupUser.member)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"自己或者组管理员才能修改"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.groupUser.member)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.groupUser.member)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = destroy(scenario.user.member)(scenario.groupUser.member)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"组管理员才能删除"`
      )
    })
  })
})
