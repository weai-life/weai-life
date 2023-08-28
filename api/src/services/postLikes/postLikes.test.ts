/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  postLikes,
  myPostLikes,
  postLike,
  likePost,
  dislikePost,
  deletePostLike,
} from './postLikes'
import type { StandardScenario } from './postLikes.scenarios'
import { db } from 'src/lib/db'

describe('postLikes', () => {
  scenario('returns all postLikes', async (scenario: StandardScenario) => {
    const result = await postLikes()

    expect(result.data.length).toEqual(Object.keys(scenario.postLike).length)
  })

  scenario('returns all my postLikes', async (scenario: StandardScenario) => {
    const cUser = await user({ id: scenario.postLike.one.userId! })
    mockCurrentUser(cUser)
    const result = await myPostLikes()

    expect(result.data.length).toEqual(1)
  })

  scenario('returns a single postLike', async (scenario: StandardScenario) => {
    const result = await postLike({ id: scenario.postLike.one.id })

    expect(result).toEqual(scenario.postLike.one)
  })

  scenario('user likes a post', async (scenario: StandardScenario) => {
    const cUser = await user({ id: scenario.postLike.one.userId! })
    mockCurrentUser(cUser)

    const result = await likePost({
      input: {
        postId: scenario.postLike.two.postId!,
      },
    })

    expect(result.userId).toEqual(scenario.postLike.one.userId)
    expect(result.postId).toEqual(scenario.postLike.two.postId)

    const post = await db.post.findUnique({ where: { id: result.postId } })
    expect(post?.likesCount).toEqual(11) // increment 1

    const list = await db.activityStream.findMany({
      where: { userId: post!.authorId },
    })
    expect(list.length).toEqual(1)
  })

  scenario('user cancel to like a post', async (scenario: StandardScenario) => {
    const cUser = await user({ id: scenario.postLike.one.userId! })
    mockCurrentUser(cUser)

    const original = await dislikePost({ postId: scenario.postLike.one.postId })
    const result = await postLike({ id: original.id })

    expect(result).toEqual(null)

    const post = await db.post.findUnique({ where: { id: original.postId } })
    expect(post?.likesCount).toEqual(9) // decrement 1
  })

  scenario('deletes a postLike', async (scenario: StandardScenario) => {
    const original = await deletePostLike({ id: scenario.postLike.one.id })
    const result = await postLike({ id: original.id })

    expect(result).toEqual(null)

    const post = await db.post.findUnique({ where: { id: original.postId } })
    expect(post?.likesCount).toEqual(9) // decrement 1
  })
})

function user({ id }) {
  return db.user.findUnique({ where: { id } })
}
