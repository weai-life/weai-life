export const standard = {
  user: {
    one: {
      data: {
        mobile: 'actStats1438399',
        name: 'String',
        updatedAt: '2021-10-27T09:13:03Z',
      },
    },
  },
  activityStat: {
    one: {
      data: {
        updatedAt: '2021-10-27T09:13:03Z',
        date: '2021-10-27T00:00:00Z',
        user: {
          connect: {
            mobile: 'actStats1438399',
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-10-27T09:13:03Z',
        date: '2021-10-27T00:00:00Z',
        user: {
          create: {
            mobile: 'actStats9702374',
            name: 'String',
            updatedAt: '2021-10-27T09:13:03Z',
          },
        },
      },
    },
  },
}

export type StandardScenario = typeof standard
