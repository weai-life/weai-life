import { read, create, update, destroy, quit } from './channelMemberPolicy'

describe('channelMemberPolicy', () => {
  describe('read', () => {
    scenario('throw error when not a member', async (scenario) => {
      await expect(
        read(scenario.user.other)(scenario.channel.one.id)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"您还不是频道成员无法访问"`)
    })

    scenario('success for member', async (scenario) => {
      await expect(
        read(scenario.user.member)(scenario.channel.one.id)
      ).resolves.toEqual(true)
    })

    scenario('success for owner', async (scenario) => {
      await expect(
        read(scenario.user.owner)(scenario.channel.one.id)
      ).resolves.toEqual(true)
    })

    scenario('success for admin', async (scenario) => {
      await expect(
        read(scenario.user.admin)(scenario.channel.one.id)
      ).resolves.toEqual(true)
    })
  })

  describe('create', () => {
    scenario('throw error when user is not a member', async (scenario) => {
      await expect(
        create(scenario.user.other)(scenario.channel.one.id)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"您不是频道管理员无法访问"`)
    })

    scenario('success when user is admin', async (scenario) => {
      await expect(
        create(scenario.user.admin)(scenario.channel.one.id)
      ).resolves.toEqual(true)
    })

    scenario('success when user is owner', async (scenario) => {
      await expect(
        create(scenario.user.owner)(scenario.channel.one.id)
      ).resolves.toEqual(true)
    })
  })

  describe('update', () => {
    scenario('throw error when user is not admin', async (scenario) => {
      await expect(
        update(scenario.user.member)(scenario.channel.one.id)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"您不是频道管理员无法访问"`)
    })

    scenario('success when user is admin', async (scenario) => {
      await expect(
        update(scenario.user.admin)(scenario.channel.one.id)
      ).resolves.toEqual(true)
    })

    scenario('success when user is owner', async (scenario) => {
      await expect(
        update(scenario.user.owner)(scenario.channel.one.id)
      ).resolves.toEqual(true)
    })
  })

  describe('destroy', () => {
    scenario('throw error when user is not admin', async (scenario) => {
      await expect(
        destroy(scenario.user.member)(scenario.channelMember.one)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"您不是频道管理员无法访问"`)
    })

    scenario('throw error when delete owner', async (scenario) => {
      await expect(
        destroy(scenario.user.owner)(scenario.channelMember.owner)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"不能删除频道主"`)
    })

    scenario('success when user is admin', async (scenario) => {
      await expect(
        destroy(scenario.user.admin)(scenario.channelMember.one)
      ).resolves.toEqual(true)
    })

    scenario('success when user is owner', async (scenario) => {
      await expect(
        destroy(scenario.user.owner)(scenario.channelMember.one)
      ).resolves.toEqual(true)
    })
  })

  describe('quit', () => {
    scenario('throw error when not a member', async (scenario) => {
      const target = scenario.channelMember.one
      await expect(
        quit(scenario.user.other)(target)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"您不是频道成员无法访问"`)
    })

    scenario('success for member', async (scenario) => {
      const target = scenario.channelMember.one
      await expect(quit(scenario.user.member)(target)).resolves.toEqual(true)
    })
  })
})
