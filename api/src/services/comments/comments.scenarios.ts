export const standard = defineScenario({
  user: {
    one: {
      data: {
        mobile: 'comment3466856',
        name: 'String',
        updatedAt: '2021-07-14T17:31:47Z',
      },
    },
    two: {
      data: {
        mobile: 'comment7429293',
        name: 'String',
        updatedAt: '2021-07-14T17:31:47Z',
      },
    },
  },
  channel: {
    one: {
      data: {
        title: 'String',
        description: 'Description',
        author: { connect: { mobile: 'comment3466856' } },
        channelMembers: {
          create: [
            {
              user: {
                connect: {
                  mobile: 'comment3466856',
                },
              },
              status: 'JOINED',
              unreadPostCount: 5,
            },
          ],
        },
      },
    },
    two: {
      data: {
        title: 'String',
        description: 'Description',
        author: { connect: { mobile: 'comment7429293' } },
        channelMembers: {
          create: [
            {
              user: {
                connect: {
                  mobile: 'comment7429293',
                },
              },
              status: 'JOINED',
              unreadPostCount: 5,
            },
          ],
        },
      },
    },
  },
  post: {
    one: {
      data: {
        content: 'String',
        author: {
          connect: {
            mobile: 'comment3466856',
          },
        },
      },
    },
    two: {
      data: {
        content: 'String',
        author: {
          connect: {
            mobile: 'comment7429293',
          },
        },
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
            mobile: 'comment3466856',
          },
        },
        post: {
          create: {
            updatedAt: '2021-07-14T17:31:47Z',
            content: 'String',
            author: {
              create: {
                mobile: 'comment4506055',
                name: 'String',
                updatedAt: '2021-07-14T17:31:47Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-07-14T17:31:47Z',
        content: 'String',
        author: {
          connect: {
            mobile: 'comment7429293',
          },
        },
        post: {
          create: {
            updatedAt: '2021-07-14T17:31:47Z',
            content: 'String',
            store: { shortContent: 'Short message' },
            author: {
              create: {
                mobile: 'comment6088746',
                name: 'String',
                updatedAt: '2021-07-14T17:31:47Z',
              },
            },
          },
        },
        comments: {
          create: [
            {
              content: 'Content',
              author: {
                connect: {
                  mobile: 'comment7429293',
                },
              },
              post: {
                create: {
                  updatedAt: '2021-07-14T17:31:47Z',
                  content: 'String',
                  author: {
                    connect: {
                      mobile: 'comment6088746',
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
