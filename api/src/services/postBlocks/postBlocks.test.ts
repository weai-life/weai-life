import { db } from 'src/lib/db'
import {
  postBlocks,
  postBlock,
  createPostBlock,
  updatePostBlock,
  deletePostBlock,
  positionPostBlocks,
} from './postBlocks'
import type { StandardScenario } from './postBlocks.scenarios'

describe('postBlocks', () => {
  scenario('returns all postBlocks', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.two)
    const result = await postBlocks()

    expect(result.length).toEqual(Object.keys(scenario.postBlock).length)
  })

  scenario('returns a single postBlock', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await postBlock({ id: scenario.postBlock.one.id })

    expect(result).toEqual(scenario.postBlock.one)
  })

  scenario('creates a postBlock', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await createPostBlock({
      input: {
        blockId: scenario.postBlock.one.blockId,
        postId: scenario.postBlock.one.postId,
      },
    })

    expect(result.blockId).toEqual(scenario.postBlock.one.blockId)
    expect(result.postId).toEqual(scenario.postBlock.one.postId)
  })

  scenario('updates a postBlock', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const original = await postBlock({ id: scenario.postBlock.one.id })
    const result = await updatePostBlock({
      id: original.id,
      input: { position: 2 },
    })

    expect(result.position).toEqual(2)
  })

  scenario('deletes a postBlock', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const original = await deletePostBlock({ id: scenario.postBlock.one.id })
    const result = await db.postBlock.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario(
    'cascade deletes postBlocks when post deleted',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const original = await db.post.delete({
        where: {
          id: scenario.postBlock.one.postId,
        },
      })
      const result = await db.postBlock.findFirst({
        where: { postId: original.id },
      })

      expect(result).toEqual(null)
    }
  )

  scenario('position postBlocks', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const postBlock1 = scenario.postBlock.one

    // 相同的post内再增加一个 postBlock
    const postBlock2 = await createPostBlock({
      input: {
        blockId: scenario.block.one.id,
        postId: scenario.postBlock.one.postId,
      },
    })

    // 排序 postBlock
    await positionPostBlocks({
      postId: scenario.postBlock.one.postId,
      input: {
        ids: [postBlock2.id, postBlock1.id],
      },
    })

    // 确认排序后结果
    const result2 = await postBlock({ id: postBlock2.id })
    expect(result2.position).toEqual(0)

    const result1 = await postBlock({ id: postBlock1.id })
    expect(result1.position).toEqual(1)
  })
})
