import {
  create,
  destroy,
  list,
  update,
  read,
  join,
  quit,
  pullUser,
  inviteUser,
  createPage,
  updatePage,
  deletePage,
  transferChannel,
} from './channelPolicy'

describe('channelPolicy', () => {
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
    scenario('success when user is owner', async (scenario) => {
      const result = read(scenario.user.owner)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is member', async (scenario) => {
      const result = read(scenario.user.member)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when channel is public', async (scenario) => {
      const result = read(null)(scenario.channel.public)
      await expect(result).resolves.toBe(true)
    })

    scenario(
      'success when channel is public and user is login',
      async (scenario) => {
        const result = read(scenario.user.other)(scenario.channel.public)
        await expect(result).resolves.toBe(true)
      }
    )

    scenario(
      'success when public channel with public group',
      async (scenario) => {
        const result = read(null)(scenario.channel.publicChannelPublicGroup)
        await expect(result).resolves.toBe(true)
      }
    )

    scenario(
      'failed when private channel with public group',
      async (scenario) => {
        const result = read(scenario.user.other)(
          scenario.channel.privateChannelPublicGroup
        )
        await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
          `"您还不是频道成员无权访问"`
        )
      }
    )

    scenario('failed when user has no permission', async (scenario) => {
      const result = read(scenario.user.other)(scenario.channel.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您还不是频道成员无权访问"`
      )
    })

    scenario('failed for anonymous', async (scenario) => {
      const result = read(null)(scenario.channel.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"This channel is private and you do not have permission to access it."`
      )
    })
  })

  describe('create', () => {
    scenario('success when user is admin', async (scenario) => {
      const result = create(scenario.user.admin)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is group owner', async (scenario) => {
      const result = create(scenario.user.groupOwner)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user has create role', async (scenario) => {
      const result = create(scenario.user.createChannel)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when channel without group', async (scenario) => {
      const result = create(scenario.user.createChannel)(null)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is other', async (scenario) => {
      const result = create(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有生成小组频道的权限"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = update(scenario.user.owner)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is group owner', async (scenario) => {
      const result = update(scenario.user.groupOwner)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user has update role', async (scenario) => {
      const result = update(scenario.user.updateChannel)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.other)(scenario.channel.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有修改小组频道的权限"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is group owner', async (scenario) => {
      const result = destroy(scenario.user.groupOwner)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user has delete role', async (scenario) => {
      const result = destroy(scenario.user.deleteChannel)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = destroy(scenario.user.other)(scenario.channel.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有删除小组频道的权限"`
      )
    })
  })

  describe('pullUser', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = pullUser(scenario.user.owner)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = pullUser(scenario.user.admin)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is manager', async (scenario) => {
      const result = pullUser(scenario.user.manager)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = pullUser(scenario.user.other)(scenario.channel.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道管理员才能拉人"`
      )
    })
  })

  describe('join', () => {
    scenario('success when user is not the member', async (scenario) => {
      const result = join(scenario.user.other)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user is member', async (scenario) => {
      const result = join(scenario.user.member)(scenario.channel.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"已经在频道中了"`
      )
    })
  })

  describe('quit', () => {
    scenario('success when user is the member', async (scenario) => {
      const result = quit(scenario.user.member)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user is not member', async (scenario) => {
      const result = quit(scenario.user.other)(scenario.channel.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"不在频道中"`
      )
    })
  })

  describe('inviteUser', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = inviteUser(scenario.user.owner)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = inviteUser(scenario.user.admin)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is manager', async (scenario) => {
      const result = inviteUser(scenario.user.manager)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is inviteable', async (scenario) => {
      const result = inviteUser(scenario.user.inviteable)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = inviteUser(scenario.user.other)(scenario.channel.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有邀请权限"`
      )
    })
  })

  describe('transferChannel', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = transferChannel(scenario.user.owner)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = transferChannel(scenario.user.admin)(scenario.channel.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = transferChannel(scenario.user.manager)(
        scenario.channel.one
      )
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道所有者才能移交频道"`
      )
    })
  })
})
