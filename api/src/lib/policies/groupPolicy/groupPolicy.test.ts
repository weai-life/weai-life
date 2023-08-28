import {
  create,
  destroy,
  list,
  update,
  read,
  join,
  quit,
  inviteUser,
  pullUser,
  reviewApplication,
  searchUserByMobile,
} from './groupPolicy'

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
    scenario('success when user is owner', async (scenario) => {
      const result = read(scenario.user.owner)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when channel is member', async (scenario) => {
      const result = read(scenario.user.member)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = read(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您无权访问"`
      )
    })

    scenario('success when group is public', async (scenario) => {
      const result = read(scenario.user.other)(scenario.group.public)
      await expect(result).resolves.toBe(true)
    })

    scenario(
      'success when anonymouse user access public group',
      async (scenario) => {
        const result = read(null)(scenario.group.public)
        await expect(result).resolves.toBe(true)
      }
    )
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
      const result = update(scenario.user.owner)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = update(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能修改"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = destroy(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能删除"`
      )
    })
  })

  describe('inviteUser', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = inviteUser(scenario.user.owner)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = inviteUser(scenario.user.admin)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = inviteUser(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有邀请用户的权限"`
      )
    })
  })

  describe('pullUser', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = pullUser(scenario.user.owner)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = pullUser(scenario.user.admin)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = pullUser(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有拉用户的权限"`
      )
    })
  })

  describe('join', () => {
    scenario('success when user is not the member', async (scenario) => {
      const result = join(scenario.user.other)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user is member', async (scenario) => {
      const result = join(scenario.user.member)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"已经在小组了"`
      )
    })
  })

  describe('quit', () => {
    scenario('success when user is the member', async (scenario) => {
      const result = quit(scenario.user.member)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user is not member', async (scenario) => {
      const result = quit(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"不在小组中"`
      )
    })

    scenario('failed when user is owner', async (scenario) => {
      const result = quit(scenario.user.owner)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `" 小组创建者不能退出频道"`
      )
    })
  })

  describe('reviewApplicaiton', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = reviewApplication(scenario.user.owner)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = reviewApplication(scenario.user.admin)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = reviewApplication(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有审核申请的权限"`
      )
    })
  })

  describe('searchUserByMobile', () => {
    scenario('success when user is owner', async (scenario) => {
      const result = searchUserByMobile(scenario.user.owner)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is admin', async (scenario) => {
      const result = searchUserByMobile(scenario.user.admin)(scenario.group.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      const result = searchUserByMobile(scenario.user.other)(scenario.group.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您没有查找用户的权限"`
      )
    })
  })
})
