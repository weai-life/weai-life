export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'post9364825', name: 'String' },
    },
    two: {
      data: { mobile: 'post5727830', name: 'String' },
    },
    admin: {
      data: { mobile: 'post5727831', name: 'String', isAdmin: true },
    },
  },
  post: {
    one: {
      data: {
        updatedAt: '2021-06-01T08:47:04Z',
        title: 'String',
        content: 'String',
        isDraft: false,
        publishedAt: '2021-06-01T08:47:04Z',
        author: { connect: { mobile: 'post9364825' } },
        channel: {
          create: {
            name: 'String',
            lastPostAt: '2021-06-01T08:47:04Z',
            author: {
              create: {
                mobile: 'post9634141',
                name: 'String',
              },
            },
            isPublic: true,
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-06-01T08:47:04Z',
        title: 'String',
        content: 'String',
        isDraft: true,
        publishedAt: null,
        author: { connect: { mobile: 'post5727830' } },
      },
    },
  },
  channelMember: {
    one: {
      data: {
        status: 'JOINED',
        channel: {
          create: {
            name: 'String',
            author: {
              create: {
                mobile: 'post9614142',
                name: 'String',
              },
            },
          },
        },
        user: { connect: { mobile: 'post9364825' } },
      },
    },
    two: {
      data: {
        updatedAt: '2021-06-01T09:59:29Z',
        status: 'JOINED',
        channel: {
          create: {
            name: 'String',
            author: {
              create: {
                mobile: 'post9312143',
                name: 'String',
              },
            },
          },
        },
        user: { connect: { mobile: 'post5727830' } },
      },
    },
  },
})
