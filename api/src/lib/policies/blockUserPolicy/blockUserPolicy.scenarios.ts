export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'bup289539800', name: 'String', isAdmin: true },
    },
    owner: {
      data: { mobile: 'bup289539801', name: 'String' },
    },
    blocked: {
      data: { mobile: 'bup289539802', name: 'String' },
    },
    other: {
      data: { mobile: 'bup289539803', name: 'String' },
    },
  },
  blockUser: {
    one: {
      data: {
        updatedAt: '2021-08-05T10:04:02Z',
        user: { connect: { mobile: 'bup289539801' } },
        blockedUser: { connect: { mobile: 'bup289539802' } },
      },
    },
  },
})

export type StandardScenario = typeof standard
