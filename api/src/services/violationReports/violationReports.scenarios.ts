export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'vioreport2895398', name: 'String' },
    },
    admin: {
      data: { mobile: 'vioreporte9767701', name: 'String', isAdmin: true },
    },
  },
  violationReport: {
    one: {
      data: {
        updatedAt: '2021-11-01T14:16:03Z',
        violationCategory: {
          create: { updatedAt: '2021-11-01T14:16:03Z', name: 'String' },
        },
        reporter: {
          create: {
            mobile: 'vioreport8171202',
            name: 'String',
            updatedAt: '2021-11-01T14:16:03Z',
          },
        },
        post: {
          create: {
            updatedAt: '2021-11-01T14:16:03Z',
            author: {
              create: {
                mobile: 'vioreport1052666',
                name: 'String',
                updatedAt: '2021-11-01T14:16:03Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-11-01T14:16:03Z',
        violationCategory: {
          create: { updatedAt: '2021-11-01T14:16:03Z', name: 'String' },
        },
        reporter: {
          create: {
            mobile: 'vioreport4017414',
            name: 'String',
            updatedAt: '2021-11-01T14:16:03Z',
          },
        },
        post: {
          create: {
            updatedAt: '2021-11-01T14:16:03Z',
            author: {
              create: {
                mobile: 'vioreport1587168',
                name: 'String',
                updatedAt: '2021-11-01T14:16:03Z',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
