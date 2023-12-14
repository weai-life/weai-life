export const standard = defineScenario({
  user: {
    owner: {
      data: { mobile: 'group4123908', name: 'String' },
    },
    member: {
      data: { mobile: 'group4123902', name: 'String' },
    },
    other: {
      data: { mobile: '18012121212', name: 'String' },
    },
    admin: {
      data: { mobile: 'group4123909', name: 'String', isAdmin: true },
    },
  },
  group: {
    one: {
      data: {
        name: 'String',
        description: 'Description',
        owner: { connect: { mobile: 'group4123908' } },
        groupUsers: {
          create: [
            {
              status: 'JOINED',
              user: { connect: { mobile: 'group4123902' } },
            },
          ],
        },
        channels: {
          create: [
            {
              name: 'channel 1',
              author: { connect: { mobile: 'group4123908' } },
              channelMembers: {
                create: [
                  {
                    status: 'JOINED',
                    user: { connect: { mobile: 'group4123902' } },
                  },
                ],
              },
            },
          ],
        },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'Description',
        owner: { connect: { mobile: 'group4123908' } },
      },
    },
    public: {
      data: {
        name: 'public group',
        description: 'Description',
        public: true,
        owner: { connect: { mobile: 'group4123908' } },
      },
    },
  },
})
