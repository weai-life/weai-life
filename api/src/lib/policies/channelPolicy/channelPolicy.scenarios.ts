export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'channelP123908', name: 'String', isAdmin: true },
    },
    groupOwner: {
      data: { mobile: 'channelP123903', name: 'String' },
    },
    owner: {
      data: { mobile: 'channelP123907', name: 'String' },
    },
    member: {
      data: { mobile: 'channelP123909', name: 'String' },
    },
    manager: {
      data: { mobile: 'channelP123901', name: 'String' },
    },
    inviteable: {
      data: { mobile: 'channelP123902', name: 'String' },
    },
    other: {
      data: { mobile: 'channelP123900', name: 'String' },
    },
    createChannel: {
      data: { mobile: 'channelP123910', name: 'String' },
    },
    updateChannel: {
      data: { mobile: 'channelP123911', name: 'String' },
    },
    deleteChannel: {
      data: { mobile: 'channelP123912', name: 'String' },
    },
  },
  group: {
    one: {
      data: {
        name: 'one',
        owner: { connect: { mobile: 'channelP123903' } },
        roles: {
          create: [
            {
              name: 'createChannel',
              users: {
                connect: [{ mobile: 'channelP123910' }],
              },
              permissions: {
                create: [
                  {
                    key: 'CREATE_CHANNEL',
                    name: 'CREATE_CHANNEL',
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
  channel: {
    one: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        name: 'String',
        description: 'Description',
        author: { connect: { mobile: 'channelP123907' } },
        channelMembers: {
          create: [
            {
              user: { connect: { mobile: 'channelP123901' } },
              updatedAt: '2021-06-01T09:59:29Z',
              status: 'JOINED',
              isAdmin: true,
            },
            {
              user: { connect: { mobile: 'channelP123909' } },
              updatedAt: '2021-06-01T09:59:29Z',
              status: 'JOINED',
              isAdmin: false,
            },
            {
              user: { connect: { mobile: 'channelP123902' } },
              updatedAt: '2021-06-01T09:59:29Z',
              status: 'JOINED',
              isAdmin: false,
              inviteable: true,
            },
          ],
        },
        group: {
          create: {
            name: 'one',
            owner: { connect: { mobile: 'channelP123903' } },
            roles: {
              create: [
                {
                  name: 'updateChannel',
                  users: {
                    connect: [{ mobile: 'channelP123911' }],
                  },
                  permissions: {
                    create: [
                      {
                        key: 'UPDATE_CHANNEL',
                        name: 'UPDATE_CHANNEL',
                      },
                    ],
                  },
                },
                {
                  name: 'deleteChannel',
                  users: {
                    connect: [{ mobile: 'channelP123912' }],
                  },
                  permissions: {
                    create: [
                      {
                        key: 'DELETE_CHANNEL',
                        name: 'DELETE_CHANNEL',
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },
    public: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        name: 'String',
        description: 'Description',
        isPublic: true,
        author: { connect: { mobile: 'channelP123907' } },
      },
    },
    privateChannelPublicGroup: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        name: 'String',
        description: 'Description',
        author: { connect: { mobile: 'channelP123907' } },
        group: {
          create: {
            name: 'one',
            owner: { connect: { mobile: 'channelP123903' } },
            public: true,
          },
        },
      },
    },
    publicChannelPublicGroup: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        name: 'String',
        description: 'Description',
        isPublic: true,
        author: { connect: { mobile: 'channelP123907' } },
        group: {
          create: {
            name: 'one',
            owner: { connect: { mobile: 'channelP123903' } },
            public: true,
          },
        },
      },
    },
  },
})
