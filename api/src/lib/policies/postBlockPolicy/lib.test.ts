import { authorizePostRead, authorizePostUpdate } from './lib'

import * as PostPolicy from '../postPolicy/postPolicy'

jest.mock('../postPolicy/postPolicy')

const successFn = async () => true
const failedFn = async () => Promise.reject(new Error('error msg'))

describe('postBlockPolicy/lib', () => {
  describe('authorizePostUpdate', () => {
    scenario('success when user has permission', async (scenario) => {
      PostPolicy.update.mockReturnValue(successFn)
      const result = authorizePostUpdate(scenario.user.one)(
        scenario.post.one.id
      )
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      PostPolicy.update.mockReturnValue(failedFn)
      const result = authorizePostUpdate(scenario.user.one)(
        scenario.post.one.id
      )
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })

    scenario('failed when can not find post', async (scenario) => {
      PostPolicy.update.mockReturnValue(successFn)
      const result = authorizePostUpdate(scenario.user.one)(0)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"未找到 Post"`
      )
    })
  })

  describe('authorizePostRead', () => {
    scenario('success when user has permission', async (scenario) => {
      PostPolicy.read.mockReturnValue(successFn)
      const result = authorizePostRead(scenario.user.one)(scenario.post.one.id)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      PostPolicy.read.mockReturnValue(failedFn)
      const result = authorizePostRead(scenario.user.one)(scenario.post.one.id)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })

    scenario('failed when can not find post', async (scenario) => {
      PostPolicy.read.mockReturnValue(successFn)
      const result = authorizePostUpdate(scenario.user.one)(0)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"未找到 Post"`
      )
    })
  })
})
