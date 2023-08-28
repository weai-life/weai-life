export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'postBP123908', name: 'String', isAdmin: true },
    },
    member: {
      data: { mobile: 'postBP123909', name: 'String' },
    },
    other: {
      data: { mobile: 'postBP123900', name: 'String' },
    },
    owner: {
      data: { mobile: 'postBP123903', name: 'String' },
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
        author: {
          connect: {
            mobile: 'postBP123903',
          },
        },
        channel: {
          create: {
            title: 'String',
            lastPostAt: '2021-06-01T08:47:04Z',
            author: {
              create: {
                mobile: 'postBP123901',
                name: 'String',
              },
            },
            isPublic: true,
            channelMembers: {
              create: [
                {
                  user: { connect: { mobile: 'postBP123908' } },
                  updatedAt: '2021-06-01T09:59:29Z',
                  status: 'JOINED',
                  isAdmin: true,
                },
                {
                  user: { connect: { mobile: 'postBP123909' } },
                  updatedAt: '2021-06-01T09:59:29Z',
                  status: 'JOINED',
                  isAdmin: false,
                },
              ],
            },
          },
        },
      },
    },
  },
})
