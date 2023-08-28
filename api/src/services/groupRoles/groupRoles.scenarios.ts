export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'gr4123901', name: 'String' },
    },
    two: {
      data: { mobile: 'gr4123902', name: 'String' },
    },
    three: {
      data: { mobile: 'gr4123903', name: 'String' },
    },
    admin: {
      data: { mobile: 'gr4123909', name: 'String', isAdmin: true },
    },
  },
  permission: {
    one: {
      data: { updatedAt: '2022-01-02T14:17:54Z', key: 'one', name: 'one' },
    },
    two: {
      data: { updatedAt: '2022-01-02T14:17:54Z', key: 'two', name: 'two' },
    },
    three: {
      data: { updatedAt: '2022-01-02T14:17:54Z', key: 'three', name: 'three' },
    },
  },
  groupRole: {
    one: {
      data: {
        updatedAt: '2022-01-05T09:24:43Z',
        name: 'one',
        group: {
          create: {
            name: 'String',
            owner: {
              create: {
                mobile: 'String5763966',
                name: 'String',
                updatedAt: '2022-01-05T09:24:44Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2022-01-05T09:24:44Z',
        name: 'two',
        group: {
          create: {
            name: 'String',
            owner: {
              create: {
                mobile: 'String2060322',
                name: 'String',
                updatedAt: '2022-01-05T09:24:44Z',
              },
            },
          },
        },
        permissions: {
          connect: [{ key: 'two' }],
        },
        users: {
          connect: [{ mobile: 'gr4123902' }],
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
