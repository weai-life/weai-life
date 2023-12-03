/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { db } from 'src/lib/db'
import { notification } from 'src/lib/utils'

import {
  posts,
  publicPosts,
  myPosts,
  post,
  createPost,
  updatePost,
  deletePost,
} from './posts'

const mockSendNotification = jest.fn()
notification.newPost = mockSendNotification

describe('posts', () => {
  scenario('returns all published posts', async (scenario) => {
    mockCurrentUser(scenario.user.admin)
    const result = await posts()

    expect(result.data.length).toEqual(Object.keys(scenario.post).length - 1)
  })

  scenario('returns all my posts including draft posts', async (scenario) => {
    mockCurrentUser(scenario.user.two)
    const result = await myPosts()

    expect(result.data.length).toEqual(1)
  })

  scenario('returns all public posts', async (scenario) => {
    const result = await publicPosts()

    expect(result.data.length).toEqual(1)
  })

  describe('read a post', () => {
    scenario(
      'returns a single post when channel is public',
      async (scenario) => {
        const result = await post({ id: scenario.post.one.id })

        expect(result).toEqual(scenario.post.one)
      }
    )

    scenario(
      'returns a single post when current user is author',
      async (scenario) => {
        mockCurrentUser(scenario.user.two)
        const result = await post({ id: scenario.post.two.id })

        expect(result).toEqual(scenario.post.two)
      }
    )
  })

  scenario('creates a post with no channelId', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const result = await createPost({
      input: {
        title: 'String',
        content: 'content',
        store: { shortContent: '内容摘要' },
      },
    })

    expect(result).toMatchInlineSnapshot(
      {
        authorId: scenario.user.one.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        publishedAt: expect.any(Date),
        happenedAt: expect.any(Date),
        id: expect.any(Number),
      },
      `
      Object {
        "authorId": ${scenario.user.one.id},
        "categoryId": null,
        "channelId": null,
        "commentsCount": 0,
        "content": "content",
        "schema": null,
        "createdAt": Any<Date>,
        "happenedAt": Any<Date>,
        "id": Any<Number>,
        "isDraft": false,
        "likesCount": 0,
        "publishedAt": Any<Date>,
        "store": Object {
          "shortContent": "内容摘要",
        },
        "title": "String",
        "updatedAt": Any<Date>,
      }
    `
    )
  })

  scenario('creates a post with a channelId', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const channelId = scenario.channelMember.one.channelId
    const result = await createPost({
      input: {
        title: 'String',
        content: 'content',
        channelId,
      },
    })

    expect(result).toMatchInlineSnapshot(
      {
        authorId: scenario.user.one.id,
        channelId: channelId,
        createdAt: expect.any(Date),
        happenedAt: expect.any(Date),
        updatedAt: expect.any(Date),
        publishedAt: expect.any(Date),
        id: expect.any(Number),
      },
      `
      Object {
        "authorId": ${scenario.user.one.id},
        "categoryId": null,
        "channelId": ${channelId},
        "commentsCount": 0,
        "content": "content",
        "schema": null,
        "createdAt": Any<Date>,
        "happenedAt": Any<Date>,
        "id": Any<Number>,
        "isDraft": false,
        "likesCount": 0,
        "publishedAt": Any<Date>,
        "store": Object {},
        "title": "String",
        "updatedAt": Any<Date>,
      }
    `
    )
  })

  scenario(
    'increment unreadPostCount after creates a post',
    async (scenario) => {
      const channelId = scenario.channelMember.one.channelId
      const user = scenario.user.two
      await addChannelMember(channelId, user.id)
      mockCurrentUser(user)

      // user one create a post, then user two will increment a unreadPostCount
      await createPost({
        input: {
          title: 'String',
          content: 'content',
          channelId,
        },
      })

      const result = await db.channelMember.findUnique({
        where: {
          id: scenario.channelMember.one.id,
        },
      })

      expect(result!.unreadPostCount).toEqual(1)

      expect(mockSendNotification).toHaveBeenCalled()
    }
  )

  scenario(
    '不增加自己的 unreadPostCount after creates a post',
    async (scenario) => {
      mockCurrentUser(scenario.user.one)

      await createPost({
        input: {
          title: 'String',
          content: 'content',
          channelId: scenario.channelMember.one.channelId,
        },
      })

      const result2 = await db.channelMember.findUnique({
        where: {
          id: scenario.channelMember.two.id,
        },
      })

      expect(result2!.unreadPostCount).toEqual(0)
    }
  )

  describe('update a post', () => {
    scenario('by owner', async (scenario) => {
      mockCurrentUser(scenario.user.one)
      const original = await post({ id: scenario.post.one.id })
      const result = await updatePost({
        id: original!.id,
        input: { title: 'updated', store: { shortContent: '内容短摘' } },
      })

      expect(result.title).toEqual('updated')
      expect(result.store.shortContent).toEqual('内容短摘')
    })

    scenario('with channelId', async (scenario) => {
      mockCurrentUser(scenario.user.one)
      const channelId = scenario.channelMember.one.channelId
      const original = await post({ id: scenario.post.one.id })
      const result = await updatePost({
        id: original!.id,
        input: { title: 'updated', channelId },
      })

      expect(result.title).toEqual('updated')
    })
  })

  describe('deletes a post', () => {
    scenario('by owner', async (scenario) => {
      mockCurrentUser(scenario.user.one)
      const original = await deletePost({ id: scenario.post.one.id })
      const result = await db.post.findUnique({ where: { id: original.id } })

      expect(result).toEqual(null)
    })
  })

  describe('deletes a post should update lastPostAt of channel', () => {
    scenario('by owner', async (scenario) => {
      mockCurrentUser(scenario.user.one)
      const original = await deletePost({ id: scenario.post.one.id })
      const channelId = original.channelId

      const channel = await db.channel.findUnique({ where: { id: channelId } })
      expect(channel.lastPostAt).toEqual(channel.createdAt)
    })
  })

  describe('draft', () => {
    scenario('creates a post', async (scenario) => {
      mockCurrentUser(scenario.user.one)
      const result = await createPost({
        input: {
          title: 'String',
          content: 'content',
          isDraft: true,
        },
      })

      expect(result).toMatchInlineSnapshot(
        {
          authorId: scenario.user.one.id,
          createdAt: expect.any(Date),
          happenedAt: expect.any(Date),
          updatedAt: expect.any(Date),
          id: expect.any(Number),
        },
        `
        Object {
          "authorId": ${scenario.user.one.id},
          "categoryId": null,
          "channelId": null,
          "commentsCount": 0,
          "content": "content",
          "schema": null,
          "createdAt": Any<Date>,
          "happenedAt": Any<Date>,
          "id": Any<Number>,
          "isDraft": true,
          "likesCount": 0,
          "publishedAt": null,
          "store": Object {},
          "title": "String",
          "updatedAt": Any<Date>,
        }
      `
      )
    })

    describe('update a post', () => {
      scenario(
        'update publishedAt when post is changed to published',
        async (scenario) => {
          mockCurrentUser(scenario.user.two)
          const original = await post({ id: scenario.post.two.id })
          const result = await updatePost({
            id: original!.id,
            input: { title: 'updated', isDraft: false },
          })

          expect(result.title).toEqual('updated')
          expect(result.isDraft).toEqual(false)
          expect(result.publishedAt).not.toEqual(null)
          expect(mockSendNotification).toHaveBeenCalled()
        }
      )

      scenario(
        'not update publishedAt when post is draft',
        async (scenario) => {
          mockCurrentUser(scenario.user.two)
          const original = await post({ id: scenario.post.two.id })
          const result = await updatePost({
            id: original!.id,
            input: { title: 'updated', isDraft: true },
          })

          expect(result.title).toEqual('updated')
          expect(result.isDraft).toEqual(true)
          expect(result.publishedAt).toEqual(null)
        }
      )
    })
  })

  describe('update channel lastPostAt', () => {
    scenario('create a post', async (scenario) => {
      mockCurrentUser(scenario.user.one)

      await createPost({
        input: {
          title: 'String',
          content: 'content',
          channelId: scenario.channelMember.one.channelId,
        },
      })

      const result = await db.channel.findUnique({
        where: {
          id: scenario.channelMember.one.channelId,
        },
      })

      expect(result!.lastPostAt).not.toEqual(null)
    })

    describe('update a post', () => {
      scenario(
        'update lastPostId when post is changed to published',
        async (scenario) => {
          mockCurrentUser(scenario.user.two)
          await updatePost({
            id: scenario.post.two.id,
            input: {
              isDraft: false,
              channelId: scenario.channelMember.two.channelId,
            },
          })

          const result = await db.channel.findUnique({
            where: {
              id: scenario.channelMember.two.channelId,
            },
          })

          expect(result!.lastPostAt).not.toEqual(null)
        }
      )

      scenario('not update lastPostId when post is draft', async (scenario) => {
        mockCurrentUser(scenario.user.two)

        const previous = await db.channel.findUnique({
          where: {
            id: scenario.channelMember.one.channelId,
          },
        })

        await updatePost({
          id: scenario.post.two.id,
          input: { channelId: scenario.channelMember.two.channelId },
        })

        const result = await db.channel.findUnique({
          where: {
            id: scenario.channelMember.one.channelId,
          },
        })

        expect(result!.lastPostAt).toEqual(previous.lastPostAt)
      })
    })
  })
})

describe('posts with block', () => {
  scenario('creates a post with a channelId', async (scenario) => {
    const currentUser = scenario.user.one
    mockCurrentUser(currentUser)
    const channelId = scenario.channelMember.one.channelId
    const result = await createPost({
      input: {
        title: 'String',
        content: 'content',
        channelId,
        blocks: [
          {
            content: 'block1',
            contentType: 'Text',
          },
          {
            content: 'block2',
            contentType: 'Image',
          },
        ],
      },
    })

    expect(result).toMatchInlineSnapshot(
      {
        authorId: scenario.user.one.id,
        channelId: channelId,
        createdAt: expect.any(Date),
        publishedAt: expect.any(Date),
        updatedAt: expect.any(Date),
        happenedAt: expect.any(Date),
        id: expect.any(Number),
      },
      `
      Object {
        "authorId": ${scenario.user.one.id},
        "categoryId": null,
        "channelId": ${channelId},
        "commentsCount": 0,
        "content": "content",
        "schema": null,
        "createdAt": Any<Date>,
        "happenedAt": Any<Date>,
        "id": Any<Number>,
        "isDraft": false,
        "likesCount": 0,
        "publishedAt": Any<Date>,
        "store": Object {},
        "title": "String",
        "updatedAt": Any<Date>,
      }
    `
    )

    const blocks = await db.block.findMany({
      where: { userId: currentUser.id },
    })
    expect(blocks.length).toEqual(2)

    const postBlocks = await db.postBlock.findMany({
      where: { postId: result.id },
    })
    expect(postBlocks.length).toEqual(2)

    const activityStats = await db.activityStat.findMany({
      where: {
        userId: currentUser.id,
      },
    })
    expect(activityStats.length).toEqual(1)
    expect(activityStats[0].count).toEqual(2)
  })
})

async function addChannelMember(channelId: number, userId: number) {
  return db.channelMember.create({
    data: {
      channelId,
      status: 'JOINED',
      userId,
    },
  })
}
