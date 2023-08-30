import { AccessToken } from 'src/lib/utils'

import { create, destroy, list, read, update } from './postPolicy'

describe('postPolicy', () => {
  describe('list', () => {
    scenario('success for admin user', async (scenario) => {
      const result = list(scenario.user.admin)()
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for not admin user', async (scenario) => {
      const result = list(scenario.user.member)()
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您无权访问"`
      )
    })
  })

  describe('read', () => {
    scenario('success for admin user', async (scenario) => {
      const result = read(scenario.user.admin)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success for post owner', async (scenario) => {
      const result = read(scenario.user.owner)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success for channel member', async (scenario) => {
      const result = read(scenario.user.member)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success for public channel', async (scenario) => {
      const result = read(null)(scenario.post.public)
      await expect(result).resolves.toBe(true)
    })

    scenario(
      'success for public channel when user is login',
      async (scenario) => {
        const result = read(scenario.user.other)(scenario.post.public)
        await expect(result).resolves.toBe(true)
      }
    )

    scenario('success for access token', async (scenario) => {
      const accessToken = AccessToken.encode({ id: scenario.post.one.id })
      const result = read(null)(scenario.post.one, accessToken)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for other user', async (scenario) => {
      const result = read(scenario.user.other)(scenario.post.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道成员才能访问"`
      )
    })

    scenario('failed for anonymous', async (scenario) => {
      const result = read(null)(scenario.post.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"You can not access this post, this post is private"`
      )
    })
  })

  describe('create with channelId', () => {
    scenario('success for channel member', async (scenario) => {
      const result = create(scenario.user.member)(scenario.channel.one.id)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for user who is not the member', async (scenario) => {
      const result = create(scenario.user.other)(scenario.channel.one.id)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"You can not access this post, this post is private"`
      )
    })
  })

  describe('create without channelId', () => {
    scenario('success for login user', async (scenario) => {
      const result = create(scenario.user.other)(null)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for not login user', async (_) => {
      const result = create(null)(null)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您尚未登录"`
      )
    })
  })

  describe('update with channelId', () => {
    scenario('success for channel admin', async (scenario) => {
      const target = {
        channelId: scenario.channel.one.id,
      }
      const option = { name: 'update' }
      const result = update(scenario.user.admin)(target, option)
      await expect(result).resolves.toBe(true)
    })

    scenario('success for post owner', async (scenario) => {
      const option = { name: 'update' }
      const result = update(scenario.user.owner)(scenario.post.one, option)
      await expect(result).resolves.toBe(true)
    })

    scenario(
      'failed for user who is not the channel admin',
      async (scenario) => {
        const target = {
          channelId: scenario.channel.one.id,
        }
        const option = { name: 'update' }
        const result = update(scenario.user.member)(target, option)
        await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
          `"频道管理员才能修改"`
        )
      }
    )
  })

  describe('update without channelId', () => {
    scenario('success for post owner', async (scenario) => {
      const option = { name: 'update' }
      const result = update(scenario.user.owner)(scenario.post.one, option)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for user who is not the owner', async (scenario) => {
      const option = { name: 'update' }
      const result = update(scenario.user.other)(scenario.post.one, option)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"频道管理员才能修改"`
      )
    })
  })

  describe('destroy without channelId', () => {
    scenario('success for channel admin', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success for post owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario(
      'failed for user who is not the channel admin',
      async (scenario) => {
        const result = destroy(scenario.user.member)(scenario.post.one)
        await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
          `"频道管理员才能删除"`
        )
      }
    )
  })
})
