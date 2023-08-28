export const standard = defineScenario({
  user: {
    owner: {
      data: { mobile: 'gup4123901', name: 'String' },
    },
    member: {
      data: { mobile: 'gup4123902', name: 'String' },
    },
    other: {
      data: { mobile: 'gup4123903', name: 'String' },
    },
    admin: {
      data: { mobile: 'gup4123909', name: 'String', isAdmin: true },
    },
  },
  groupUser: {
    owner: {
      data: {
        status: 'JOINED',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'gup4123901' } },
          },
        },
        user: { connect: { mobile: 'gup4123901' } },
      },
    },
    member: {
      data: {
        status: 'JOINED',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'gup4123901' } },
          },
        },
        user: { connect: { mobile: 'gup4123902' } },
      },
    },
  },
})
