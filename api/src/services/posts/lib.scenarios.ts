export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'postlibString9364825', name: 'String' },
    },
    two: {
      data: { mobile: 'postlibString5727830', name: 'String' },
    },
    admin: {
      data: { mobile: 'postlibString5727831', name: 'String', isAdmin: true },
    },
  },
  activityStat: {
    one: {
      data: {
        date: '2021-10-28',
        count: 1,
        user: {
          connect: {
            mobile: 'postlibString9364825',
          },
        },
      },
    },
  },
})
