export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'categP123908', name: 'String', isAdmin: true },
    },
    owner: {
      data: { mobile: 'categP123907', name: 'String' },
    },
    member: {
      data: { mobile: 'categP123909', name: 'String' },
    },
    manager: {
      data: { mobile: 'categP123901', name: 'String' },
    },
    other: {
      data: { mobile: 'categP123900', name: 'String' },
    },
  },
  category: {
    one: {
      data: {
        updatedAt: '2021-07-25T03:41:22Z',
        title: 'String',
        channel: {
          create: {
            updatedAt: '2021-06-01T08:34:18Z',
            title: 'String',
            description: 'Description',
            author: { connect: { mobile: 'categP123907' } },
            isPublic: false,
            channelMembers: {
              create: [
                {
                  user: { connect: { mobile: 'categP123901' } },
                  updatedAt: '2021-06-01T09:59:29Z',
                  status: 'JOINED',
                  isAdmin: true,
                },
                {
                  user: { connect: { mobile: 'categP123909' } },
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
        updatedAt: '2021-07-25T03:41:22Z',
        title: 'String',
        channel: {
          create: {
            updatedAt: '2021-07-25T03:41:22Z',
            title: 'String',
            author: {
              create: {
                mobile: 'categP223900',
                name: 'String',
                updatedAt: '2021-07-25T03:41:22Z',
              },
            },
            isPublic: true,
          },
        },
      },
    },
  },
})
