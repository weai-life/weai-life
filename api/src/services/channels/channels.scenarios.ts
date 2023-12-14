export const standard = defineScenario({
  user: {
    owner: {
      data: { mobile: 'chann4123908', name: 'String' },
    },
    groupUser: {
      data: { mobile: 'chann4123901', name: 'String' },
    },
    other: {
      data: { mobile: 'chann4123902', name: 'String' },
    },
    admin: {
      data: { mobile: 'chanString4123909', name: 'String', isAdmin: true },
    },
    member: {
      data: { mobile: 'chanString4123901', name: 'String' },
    },
  },
  group: {
    one: {
      data: {
        name: 'group 1',
        owner: {
          connect: { mobile: 'chann4123908' },
        },
        groupUsers: {
          create: [
            {
              user: { connect: { mobile: 'chann4123901' } },
              status: 'JOINED',
            },
          ],
        },
      },
    },
    two: {
      data: {
        name: 'group 2',
        owner: {
          connect: { mobile: 'chanString4123901' },
        },
        groupUsers: {
          create: [
            {
              user: { connect: { mobile: 'chann4123908' } },
              status: 'JOINED',
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
        author: { connect: { mobile: 'chann4123908' } },
        page: {
          create: {
            slug: 'channel1',
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        name: 'String',
        description: 'Description',
        author: { connect: { mobile: 'chanString4123901' } },
        isPublic: true,
        group: {
          create: {
            name: 'group 3',
            public: true,
            owner: {
              connect: { mobile: 'chann4123908' },
            },
            groupUsers: {
              create: [
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'chanString4123901' } },
                },
              ],
            },
          },
        },
        channelMembers: {
          create: [
            {
              user: { connect: { mobile: 'chanString4123901' } },
              status: 'JOINED',
            },
          ],
        },
      },
    },
  },
  channelMember: {
    one: {
      data: {
        updatedAt: '2021-06-01T09:59:29Z',
        status: 'JOINED',
        unreadPostCount: 5,
        channel: {
          create: {
            updatedAt: '2021-06-01T09:59:29Z',
            name: 'String',
            author: {
              create: {
                mobile: 'chann9614141',
                name: 'String',
                updatedAt: '2021-06-01T09:59:29Z',
              },
            },
          },
        },
        user: {
          connect: {
            mobile: 'chann4123908',
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-06-01T09:59:29Z',
        status: 'JOINED',
        channel: {
          create: {
            updatedAt: '2021-06-01T09:59:29Z',
            name: 'String',
            author: {
              create: {
                mobile: 'chann9157551',
                name: 'String',
                updatedAt: '2021-06-01T09:59:29Z',
              },
            },
          },
        },
        user: {
          create: {
            mobile: 'chann1901789',
            name: 'String',
            updatedAt: '2021-06-01T09:59:29Z',
          },
        },
      },
    },
  },
})
