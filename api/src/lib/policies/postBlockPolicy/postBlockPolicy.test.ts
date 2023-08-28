import { create, destroy, list, update, read } from './postBlockPolicy'

import { authorizePostUpdate, authorizePostRead } from './lib'

jest.mock('./lib')

const successFn = async () => true
const failedFn = async () => Promise.reject(new Error('error msg'))

describe('postBlockPolicy', () => {
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
    scenario('success when have permission', async (scenario) => {
      authorizePostRead.mockReturnValue(successFn)
      const result = read(scenario.user.one)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when have no permission', async (scenario) => {
      authorizePostRead.mockReturnValue(failedFn)
      const result = read(scenario.user.one)(scenario.post.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })
  })

  describe('create', () => {
    scenario('success when have permission', async (scenario) => {
      authorizePostUpdate.mockReturnValue(successFn)
      const result = create(scenario.user.one)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when have no permission', async (scenario) => {
      authorizePostUpdate.mockReturnValue(failedFn)
      const result = create(scenario.user.one)(scenario.post.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })
  })

  describe('update', () => {
    scenario('success when have permission', async (scenario) => {
      authorizePostUpdate.mockReturnValue(successFn)
      const result = update(scenario.user.one)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when have no permission', async (scenario) => {
      authorizePostUpdate.mockReturnValue(failedFn)
      const result = update(scenario.user.one)(scenario.post.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when have permission', async (scenario) => {
      authorizePostUpdate.mockReturnValue(successFn)
      const result = destroy(scenario.user.one)(scenario.post.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when have no permission', async (scenario) => {
      authorizePostUpdate.mockReturnValue(failedFn)
      const result = destroy(scenario.user.one)(scenario.post.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })
  })
})
