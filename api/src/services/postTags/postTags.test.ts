import type { PostTag } from '@prisma/client'

import {
  postTags,
  postTag,
  createPostTag,
  updatePostTag,
  deletePostTag,
} from './postTags'
import type { StandardScenario } from './postTags.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('postTags', () => {
  scenario('returns all postTags', async (scenario: StandardScenario) => {
    const result = await postTags()

    expect(result.length).toEqual(Object.keys(scenario.postTag).length)
  })

  scenario('returns a single postTag', async (scenario: StandardScenario) => {
    const result = await postTag({ id: scenario.postTag.one.id })

    expect(result).toEqual(scenario.postTag.one)
  })

  scenario('creates a postTag', async (scenario: StandardScenario) => {
    const result = await createPostTag({
      input: {
        postId: scenario.postTag.two.postId,
        tagId: scenario.postTag.two.tagId,
      },
    })

    expect(result.postId).toEqual(scenario.postTag.two.postId)
    expect(result.tagId).toEqual(scenario.postTag.two.tagId)
  })

  scenario('updates a postTag', async (scenario: StandardScenario) => {
    const original = (await postTag({ id: scenario.postTag.one.id })) as PostTag
    const result = await updatePostTag({
      id: original.id,
      input: { postId: scenario.postTag.two.postId },
    })

    expect(result.postId).toEqual(scenario.postTag.two.postId)
  })

  scenario('deletes a postTag', async (scenario: StandardScenario) => {
    const original = (await deletePostTag({
      id: scenario.postTag.one.id,
    })) as PostTag
    const result = await postTag({ id: original.id })

    expect(result).toEqual(null)
  })
})
