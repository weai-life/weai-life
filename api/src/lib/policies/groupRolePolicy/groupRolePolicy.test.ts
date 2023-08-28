import { list, read, create, update, destroy } from './groupRolePolicy'

describe('groupRolePolicy', () => {
  describe('list', () => {
    scenario('admin can list', async (scenario) => {
      const result = list(scenario.user.admin)(scenario.groupRole.one.groupId)
      await expect(result).resolves.toBe(true)
    })

    scenario('owner can list', async (scenario) => {
      const result = list(scenario.user.owner)(scenario.groupRole.one.groupId)
      await expect(result).resolves.toBe(true)
    })

    scenario('member can list', async (scenario) => {
      const result = list(scenario.user.member)(scenario.groupRole.one.groupId)
      await expect(result).resolves.toBe(true)
    })

    scenario('others got error', async (scenario) => {
      const result = list(scenario.user.other)(scenario.groupRole.one.groupId)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您不是小组成员无权访问"`
      )
    })
  })

  describe('read', () => {
    scenario('admin can read', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.groupRole.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('owner can read', async (scenario) => {
      const result = read(scenario.user.owner)(scenario.groupRole.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('member can read', async (scenario) => {
      const result = read(scenario.user.member)(scenario.groupRole.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('others got error', async (scenario) => {
      const result = read(scenario.user.other)(scenario.groupRole.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您不是小组成员无权访问"`
      )
    })
  })

  describe('create', () => {
    scenario('admin can create', async (scenario) => {
      const result = create(scenario.user.admin)(
        scenario.groupRole.roleCreate.groupId
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('owner can create', async (scenario) => {
      const result = create(scenario.user.owner)(
        scenario.groupRole.roleCreate.groupId
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('role Creator can create', async (scenario) => {
      const result = create(scenario.user.roleCreate)(
        scenario.groupRole.roleCreate.groupId
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('member got error', async (scenario) => {
      const result = create(scenario.user.member)(
        scenario.groupRole.roleCreate.groupId
      )
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有生成小组角色的权限"`
      )
    })

    scenario('others got error', async (scenario) => {
      const result = create(scenario.user.other)(
        scenario.groupRole.roleCreate.groupId
      )
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有生成小组角色的权限"`
      )
    })
  })

  describe('update', () => {
    scenario('admin can update', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.groupRole.roleUpdate)
      await expect(result).resolves.toBe(true)
    })

    scenario('owner can update', async (scenario) => {
      const result = update(scenario.user.owner)(scenario.groupRole.roleUpdate)
      await expect(result).resolves.toBe(true)
    })

    scenario('role Updator can update', async (scenario) => {
      const result = update(scenario.user.roleUpdate)(
        scenario.groupRole.roleUpdate
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('member got error', async (scenario) => {
      const result = update(scenario.user.member)(scenario.groupRole.roleUpdate)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有更新小组角色的权限"`
      )
    })

    scenario('others got error', async (scenario) => {
      const result = update(scenario.user.other)(scenario.groupRole.roleUpdate)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有更新小组角色的权限"`
      )
    })
  })

  describe('delete', () => {
    scenario('admin can delete', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.groupRole.roleDelete)
      await expect(result).resolves.toBe(true)
    })

    scenario('owner can delete', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.groupRole.roleDelete)
      await expect(result).resolves.toBe(true)
    })

    scenario('role Deleter can delete', async (scenario) => {
      const result = destroy(scenario.user.roleDelete)(
        scenario.groupRole.roleDelete
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('member got error', async (scenario) => {
      const result = destroy(scenario.user.member)(
        scenario.groupRole.roleDelete
      )
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有删除小组角色的权限"`
      )
    })

    scenario('others got error', async (scenario) => {
      const result = destroy(scenario.user.other)(scenario.groupRole.roleDelete)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有删除小组角色的权限"`
      )
    })
  })
})
