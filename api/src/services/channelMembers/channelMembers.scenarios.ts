export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'channM4123908', name: 'String' },
    },
  },
  channelMember: {
    one: {
      data: {
        updatedAt: '2021-06-01T09:59:29Z',
        status: 'JOINED',
        channel: {
          create: {
            updatedAt: '2021-06-01T09:59:29Z',
            name: 'String',
            author: {
              create: {
                mobile: 'channM9614141',
                name: 'String',
                updatedAt: '2021-06-01T09:59:29Z',
              },
            },
          },
        },
        user: {
          create: {
            mobile: 'channM1966174',
            name: 'String',
            updatedAt: '2021-06-01T09:59:29Z',
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
                mobile: 'channM9157551',
                name: 'String',
                updatedAt: '2021-06-01T09:59:29Z',
              },
            },
          },
        },
        user: {
          create: {
            mobile: 'channM1901789',
            name: 'String',
            updatedAt: '2021-06-01T09:59:29Z',
          },
        },
      },
    },
    three: {
      data: {
        updatedAt: '2021-06-01T09:59:29Z',
        status: 'JOINED',
        channel: {
          create: {
            updatedAt: '2021-06-01T09:59:29Z',
            name: 'String',
            author: {
              create: {
                mobile: 'channM9157552',
                name: 'String',
                updatedAt: '2021-06-01T09:59:29Z',
              },
            },
          },
        },
        user: {
          connect: {
            mobile: 'channM4123908',
          },
        },
      },
    },
  },
})
