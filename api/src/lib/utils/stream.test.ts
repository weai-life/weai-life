/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { db } from 'src/lib/db'
import { getPost } from './dbHelper'
import { commentForComment, commentForPost, postComment } from './stream'
import { notification } from 'src/lib/utils'

const mockSendNotification = jest.fn()
notification.newComment = mockSendNotification

describe('stream', () => {
  scenario('commentForPost', async (scenario) => {
    const post = await getPost(scenario.comment.one.postId)

    const result = await commentForPost(
      scenario.user.commentAuthor,
      scenario.comment.one,
      post!
    )

    expect(result.userId).toEqual(scenario.user.postAuthor.id)
  })

  scenario('commentForComment for repliedComment', async (scenario) => {
    const result = await commentForComment(
      scenario.user.commentAuthor,
      scenario.comment.one,
      scenario.comment.one.repliedCommentId
    )

    expect(result.userId).toEqual(scenario.user.repliedCommentAuthor.id)
  })

  scenario('commentForComment for topComment', async (scenario) => {
    const result = await commentForComment(
      scenario.user.commentAuthor,
      scenario.comment.one,
      scenario.comment.one.commentId
    )

    expect(result.userId).toEqual(scenario.user.topCommentAuthor.id)
  })

  describe('postComment', () => {
    scenario('commented by comment user', async (scenario) => {
      mockCurrentUser(scenario.user.commentAuthor)

      const result = await postComment(
        scenario.user.commentAuthor,
        scenario.comment.one
      )
      expect(result.count).toEqual(3)

      const post = await getPost(scenario.comment.one.postId)
      const lastStream = await db.activityStream.findFirst({
        orderBy: { id: 'desc' },
      })
      expect(lastStream.channelId).toEqual(post.channelId)

      expect(mockSendNotification).toHaveBeenCalled()
    })

    scenario('commented by repliedComment user', async (scenario) => {
      mockCurrentUser(scenario.user.commentAuthor)

      const result = await postComment(
        scenario.user.repliedCommentAuthor,
        scenario.comment.one
      )
      expect(result.count).toEqual(2)

      const post = await getPost(scenario.comment.one.postId)
      const lastStream = await db.activityStream.findFirst({
        orderBy: { id: 'desc' },
      })
      expect(lastStream.channelId).toEqual(post.channelId)

      expect(mockSendNotification).toHaveBeenCalled()
    })

    scenario('commented by topComment user', async (scenario) => {
      mockCurrentUser(scenario.user.commentAuthor)

      const result = await postComment(
        scenario.user.topCommentAuthor,
        scenario.comment.one
      )
      expect(result.count).toEqual(2)

      const post = await getPost(scenario.comment.one.postId)
      const lastStream = await db.activityStream.findFirst({
        orderBy: { id: 'desc' },
      })
      expect(lastStream.channelId).toEqual(post.channelId)

      expect(mockSendNotification).toHaveBeenCalled()
    })

    scenario('commented by post author', async (scenario) => {
      const result = await postComment(
        scenario.user.postAuthor,
        scenario.comment.one
      )
      expect(result.count).toEqual(2)

      const post = await getPost(scenario.comment.one.postId)
      const lastStream = await db.activityStream.findFirst({
        orderBy: { id: 'desc' },
      })
      expect(lastStream.channelId).toEqual(post.channelId)

      expect(mockSendNotification).toHaveBeenCalled()
    })
  })
})
