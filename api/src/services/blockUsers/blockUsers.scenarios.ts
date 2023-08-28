export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'bu289539800', name: 'String', isAdmin: true },
    },
    owner: {
      data: { mobile: 'bu289539801', name: 'String' },
    },
    blocked: {
      data: { mobile: 'bu289539802', name: 'String' },
    },
    other: {
      data: { mobile: 'bu289539803', name: 'String' },
    },
  },
  blockUser: {
    one: {
      data: {
        updatedAt: '2021-08-05T10:04:02Z',
        user: { connect: { mobile: 'bu289539801' } },
        blockedUser: { connect: { mobile: 'bu289539802' } },
      },
    },
  },
})

export type StandardScenario = typeof standard
