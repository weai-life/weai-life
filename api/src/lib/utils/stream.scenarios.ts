export const standard = defineScenario({
  user: {
    commentAuthor: {
      data: {
        mobile: 'stream3466856',
        name: 'String',
        updatedAt: '2021-07-14T17:31:47Z',
      },
    },
    repliedCommentAuthor: {
      data: {
        mobile: 'stream3466857',
        name: 'String',
        updatedAt: '2021-07-14T17:31:47Z',
      },
    },
    topCommentAuthor: {
      data: {
        mobile: 'stream3466858',
        name: 'String',
        updatedAt: '2021-07-14T17:31:47Z',
      },
    },
    postAuthor: {
      data: {
        mobile: 'stream7429293',
        name: 'String',
        updatedAt: '2021-07-14T17:31:47Z',
      },
    },
  },
  comment: {
    one: {
      data: {
        updatedAt: '2021-07-14T17:31:47Z',
        content: 'String',
        author: {
          connect: {
            mobile: 'stream3466856',
          },
        },
        post: {
          create: {
            updatedAt: '2021-07-14T17:31:47Z',
            content: 'String',
            store: { shortContent: 'Short message' },
            author: { connect: { mobile: 'stream7429293' } },
            channel: {
              create: {
                author: { connect: { mobile: 'stream7429293' } },
                updatedAt: '2021-06-01T08:34:18Z',
                title: 'String',
              },
            },
          },
        },
        comment: {
          create: {
            content: 'Content',
            author: {
              connect: {
                mobile: 'stream3466858',
              },
            },
            post: {
              create: {
                updatedAt: '2021-07-14T17:31:47Z',
                content: 'String',
                author: {
                  connect: {
                    mobile: 'stream7429293',
                  },
                },
              },
            },
          },
        },
        repliedComment: {
          create: {
            content: 'Content',
            author: {
              connect: {
                mobile: 'stream3466857',
              },
            },
            post: {
              create: {
                updatedAt: '2021-07-14T17:31:47Z',
                content: 'String',
                author: {
                  connect: {
                    mobile: 'stream7429293',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
