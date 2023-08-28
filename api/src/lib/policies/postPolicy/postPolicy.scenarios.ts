export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'postP123908', name: 'String', isAdmin: true },
    },
    member: {
      data: { mobile: 'postP123909', name: 'String' },
    },
    other: {
      data: { mobile: 'postP123900', name: 'String' },
    },
    owner: {
      data: { mobile: 'postP123903', name: 'String' },
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
            mobile: 'postP123903',
          },
        },
        channel: {
          create: {
            title: 'String',
            lastPostAt: '2021-06-01T08:47:04Z',
            author: {
              create: {
                mobile: 'postP123901',
                name: 'String',
              },
            },
            isPublic: false,
            channelMembers: {
              create: [
                {
                  user: { connect: { mobile: 'postP123908' } },
                  updatedAt: '2021-06-01T09:59:29Z',
                  status: 'JOINED',
                  isAdmin: true,
                },
                {
                  user: { connect: { mobile: 'postP123909' } },
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
    public: {
      data: {
        updatedAt: '2021-06-01T08:47:04Z',
        title: 'String',
        content: 'String',
        isDraft: false,
        publishedAt: '2021-06-01T08:47:04Z',
        author: {
          connect: {
            mobile: 'postP123903',
          },
        },
        channel: {
          create: {
            title: 'String',
            lastPostAt: '2021-06-01T08:47:04Z',
            author: {
              create: {
                mobile: 'postP123921',
                name: 'String',
              },
            },
            isPublic: true,
            channelMembers: {
              create: [
                {
                  user: { connect: { mobile: 'postP123908' } },
                  updatedAt: '2021-06-01T09:59:29Z',
                  status: 'JOINED',
                  isAdmin: true,
                },
                {
                  user: { connect: { mobile: 'postP123909' } },
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
        author: { connect: { mobile: 'postP123908' } },
        channelMembers: {
          create: [
            {
              user: { connect: { mobile: 'postP123908' } },
              updatedAt: '2021-06-01T09:59:29Z',
              status: 'JOINED',
              isAdmin: true,
            },
            {
              user: { connect: { mobile: 'postP123909' } },
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
