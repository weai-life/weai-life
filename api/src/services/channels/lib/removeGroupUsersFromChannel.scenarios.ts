export const standard = defineScenario({
  user: {
    owner: {
      data: { mobile: 'removeGU4123908', name: 'String' },
    },
    member: {
      data: { mobile: 'removeGU4123901', name: 'String' },
    },
  },
  channel: {
    one: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        title: 'String',
        description: 'Description',
        author: { connect: { mobile: 'removeGU4123908' } },
        isPublic: true,
        group: {
          create: {
            name: 'group 3',
            owner: {
              connect: { mobile: 'removeGU4123908' },
            },
            groupUsers: {
              create: [
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'removeGU4123901' } },
                },
              ],
            },
          },
        },
        channelMembers: {
          create: [
            {
              user: { connect: { mobile: 'removeGU4123908' } },
              status: 'JOINED',
            },
            {
              user: { connect: { mobile: 'removeGU4123901' } },
              status: 'JOINED',
            },
          ],
        },
      },
    },
  },
})
