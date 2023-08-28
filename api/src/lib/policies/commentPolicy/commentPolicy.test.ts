import { list, read, create, destroy, update } from './commentPolicy'

import * as PostPolicy from '../postPolicy/postPolicy'

jest.mock('../postPolicy/postPolicy')

const successFn = async () => true
const failedFn = async () => Promise.reject(new Error('error msg'))

describe('commentPolicy', () => {
  describe('list', () => {
    scenario('success when user has permission', async (scenario) => {
      PostPolicy.read.mockReturnValue(successFn)
      const result = list(scenario.user.other)({
        postId: scenario.comment.one.postId,
      })
      await expect(result).resolves.toBe(true)
    })

    scenario('success when post is public', async (scenario) => {
      PostPolicy.read.mockReturnValue(successFn)
      const result = list(null)({ postId: scenario.comment.one.postId })
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      PostPolicy.read.mockReturnValue(failedFn)
      const result = list(scenario.user.other)({
        postId: scenario.comment.one.postId,
      })
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })

    scenario('failed when post is not public', async (scenario) => {
      PostPolicy.read.mockReturnValue(failedFn)
      const result = list(null)({ postId: scenario.comment.one.postId })
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })
  })

  describe('read', () => {
    scenario('success when user has permission', async (scenario) => {
      PostPolicy.read.mockReturnValue(successFn)
      const result = read(scenario.user.other)(scenario.comment.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when post is public', async (scenario) => {
      PostPolicy.read.mockReturnValue(successFn)
      const result = read(null)(scenario.comment.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      PostPolicy.read.mockReturnValue(failedFn)
      const result = read(scenario.user.other)(scenario.comment.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })

    scenario('failed when post is not public', async (scenario) => {
      PostPolicy.read.mockReturnValue(failedFn)
      const result = read(null)(scenario.comment.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })
  })

  describe('create', () => {
    scenario('success when user has permission', async (scenario) => {
      PostPolicy.create.mockReturnValue(successFn)
      const result = create(scenario.user.other)(scenario.comment.one.postId)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user has no permission', async (scenario) => {
      PostPolicy.create.mockReturnValue(failedFn)
      const result = create(scenario.user.other)(scenario.comment.one.postId)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"error msg"`
      )
    })

    scenario('failed when cannot find post', async (scenario) => {
      const result = create(scenario.user.other)(0)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"未找到该评论的帖子"`
      )
    })
  })

  describe('update', () => {
    scenario('success when user is admin', async (scenario) => {
      const result = update(scenario.user.admin)(scenario.comment.one.postId)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is owner', async (scenario) => {
      const result = update(scenario.user.owner)(scenario.comment.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user is not owner', async (scenario) => {
      const result = update(scenario.user.other)(scenario.comment.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能修改"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success when user is admin', async (scenario) => {
      const result = destroy(scenario.user.admin)(scenario.comment.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('success when user is owner', async (scenario) => {
      const result = destroy(scenario.user.owner)(scenario.comment.one)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed when user is not owner', async (scenario) => {
      const result = destroy(scenario.user.other)(scenario.comment.one)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"创建者才能删除"`
      )
    })
  })
})
