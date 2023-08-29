import { db } from 'src/lib/db'

import {
  comments,
  myComments,
  comment,
  createComment,
  updateComment,
  deleteComment,
} from './comments'
import type { StandardScenario } from './comments.scenarios'

const getComment = (id: number) => db.comment.findUnique({ where: { id } })

describe('comments', () => {
  scenario('returns all comments', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await comments({ where: { commentId: null } })

    expect(result.data.length).toEqual(Object.keys(scenario.comment).length)
  })

  scenario('returns my comments', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await myComments()

    expect(result.data.length).toEqual(1)
  })

  scenario('returns a single comment', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await comment({ id: scenario.comment.one.id })

    expect(result).toEqual(scenario.comment.one)
  })

  scenario('creates a comment', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.two)

    await db.post.update({
      data: { channelId: scenario.channel.two.id },
      where: { id: scenario.comment.two.postId },
    })

    const result = await createComment({
      input: {
        content: 'String',
        postId: scenario.comment.two.postId,
      },
    })

    expect(result.content).toEqual('String')
    expect(result.authorId).toEqual(scenario.comment.two.authorId)
    expect(result.postId).toEqual(scenario.comment.two.postId)

    // 生成评论信息流
    const post = await db.post.findUnique({ where: { id: result.postId } })
    const list = await db.activityStream.findMany({
      where: { userId: post?.authorId },
    })
    expect(list.length).toEqual(1)

    const stream = list[0]
    expect(stream.data?.target?.shortContent).toEqual('Short message')
  })

  scenario('updates a comment', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await comment({ id: scenario.comment.one.id })
    const result = await updateComment({
      id: original.id,
      input: { content: 'hello' },
    })

    expect(result.content).toEqual('hello')
  })

  scenario('deletes a comment', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.two)

    const nestedComments = await comments({
      where: { commentId: scenario.comment.two.id },
    })

    const original = await deleteComment({ id: nestedComments.data[0].id })
    const result = await getComment(original.id)

    expect(result).toEqual(null)
    await verifyCommentsCountForPost(original.postId, -1)
    await verifyCommentsCount(scenario.comment.two.id, -1)
  })

  scenario('replies a comment', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    const post = scenario.post.one

    await db.post.update({
      data: { channelId: scenario.channel.one.id },
      where: { id: post.id },
    })

    const c1 = await createComment({
      input: {
        postId: post.id,
        content: 'comment 1',
      },
    })

    expect(c1.commentId).toEqual(null)

    const c2 = await createComment({
      input: {
        postId: post.id,
        repliedCommentId: c1.id,
        content: 'comment 2',
      },
    })

    expect(c2.commentId).toEqual(c1.id)

    const c3 = await createComment({
      input: {
        postId: post.id,
        repliedCommentId: c2.id,
        content: 'comment 2',
      },
    })

    expect(c3.commentId).toEqual(c1.id)

    const all = await comments({
      where: {
        postId: post.id,
      },
    })

    expect(all.data.length).toEqual(3)

    const top = await comments({
      where: {
        postId: post.id,
        repliedCommentId: null,
      },
    })

    expect(top.data.length).toEqual(1)

    const nested = await comments({
      where: {
        postId: post.id,
        commentId: c1.id,
      },
    })

    expect(nested.data.length).toEqual(2)

    // verify comments count for post
    await verifyCommentsCountForPost(post.id, 3)

    // verify comments count for top comment
    await verifyCommentsCount(c1.id, 2)

    // verify comments count for level 2 comment
    await verifyCommentsCount(c2.id, 0)
  })
})

async function verifyCommentsCountForPost(postId, count) {
  const post = await db.post.findUnique({
    where: { id: postId },
  })
  expect(post?.commentsCount).toEqual(count)
}

async function verifyCommentsCount(commentId, count) {
  const comment = await db.comment.findUnique({
    where: { id: commentId },
  })
  expect(comment?.commentsCount).toEqual(count)
}
