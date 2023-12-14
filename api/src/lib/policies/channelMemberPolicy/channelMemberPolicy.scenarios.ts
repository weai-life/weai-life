export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'chanMP123908', name: 'String', isAdmin: true },
    },
    owner: {
      data: { mobile: 'chanMP123907', name: 'String' },
    },
    member: {
      data: { mobile: 'chanMP123909', name: 'String' },
    },
    manager: {
      data: { mobile: 'chanMP123901', name: 'String' },
    },
    other: {
      data: { mobile: 'chanMP123900', name: 'String' },
    },
  },
  channel: {
    one: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        name: 'String',
        description: 'Description',
        author: { connect: { mobile: 'chanMP123907' } },
        channelMembers: {
          create: [
            {
              user: { connect: { mobile: 'chanMP123901' } },
              updatedAt: '2021-06-01T09:59:29Z',
              status: 'JOINED',
              isAdmin: true,
            },
            {
              user: { connect: { mobile: 'chanMP123909' } },
              updatedAt: '2021-06-01T09:59:29Z',
              status: 'JOINED',
              isAdmin: false,
            },
          ],
        },
      },
    },
  },
  channelMember: {
    one: {
      data: {
        user: { connect: { mobile: 'chanMP123909' } },
        updatedAt: '2021-06-01T09:59:29Z',
        status: 'JOINED',
        channel: {
          create: {
            updatedAt: '2021-06-01T08:34:18Z',
            name: 'String',
            description: 'Description',
            author: { connect: { mobile: 'chanMP123907' } },
          },
        },
      },
    },
    owner: {
      data: {
        user: { connect: { mobile: 'chanMP123907' } },
        updatedAt: '2021-06-01T09:59:29Z',
        status: 'JOINED',
        channel: {
          create: {
            updatedAt: '2021-06-01T08:34:18Z',
            name: 'String',
            description: 'Description',
            author: { connect: { mobile: 'chanMP123907' } },
          },
        },
      },
    },
  },
})
