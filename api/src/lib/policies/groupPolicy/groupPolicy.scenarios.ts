export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'channelP123908', name: 'String', isAdmin: true },
    },
    owner: {
      data: { mobile: 'channelP123907', name: 'String' },
    },
    member: {
      data: { mobile: 'channelP123909', name: 'String' },
    },
    other: {
      data: { mobile: 'channelP123900', name: 'String' },
    },
  },
  group: {
    one: {
      data: {
        name: 'String',
        description: 'Description',
        owner: { connect: { mobile: 'channelP123907' } },
        groupUsers: {
          create: [
            {
              status: 'JOINED',
              user: { connect: { mobile: 'channelP123907' } },
            },
            {
              status: 'JOINED',
              user: { connect: { mobile: 'channelP123909' } },
            },
          ],
        },
      },
    },
    public: {
      data: {
        name: 'String',
        public: true,
        description: 'Description',
        owner: { connect: { mobile: 'channelP123907' } },
      },
    },
  },
})
