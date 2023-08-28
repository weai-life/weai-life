export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'postBPL123908', name: 'String', isAdmin: true },
    },
    member: {
      data: { mobile: 'postBPL123909', name: 'String' },
    },
    other: {
      data: { mobile: 'postBPL123900', name: 'String' },
    },
    owner: {
      data: { mobile: 'postBPL123903', name: 'String' },
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
            mobile: 'postBPL123903',
          },
        },
        channel: {
          create: {
            title: 'String',
            lastPostAt: '2021-06-01T08:47:04Z',
            author: {
              create: {
                mobile: 'postBPL123901',
                name: 'String',
              },
            },
            isPublic: true,
            channelMembers: {
              create: [
                {
                  user: { connect: { mobile: 'postBPL123908' } },
                  updatedAt: '2021-06-01T09:59:29Z',
                  status: 'JOINED',
                  isAdmin: true,
                },
                {
                  user: { connect: { mobile: 'postBPL123909' } },
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
  channel: {
    one: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        title: 'String',
        description: 'Description',
        author: { connect: { mobile: 'postBPL123908' } },
        channelMembers: {
          create: [
            {
              user: { connect: { mobile: 'postBPL123908' } },
              updatedAt: '2021-06-01T09:59:29Z',
              status: 'JOINED',
              isAdmin: true,
            },
            {
              user: { connect: { mobile: 'postBPL123909' } },
              updatedAt: '2021-06-01T09:59:29Z',
              status: 'JOINED',
              isAdmin: false,
            },
          ],
        },
      },
    },
  },
})
