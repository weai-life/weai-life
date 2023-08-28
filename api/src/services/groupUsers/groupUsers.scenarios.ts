export const standard = defineScenario({
  user: {
    owner: {
      data: { mobile: 'gu4123901', name: 'String' },
    },
    member: {
      data: { mobile: 'gu4123902', name: 'String' },
    },
    other: {
      data: { mobile: 'gu4123903', name: 'String' },
    },
    admin: {
      data: { mobile: 'gu4123909', name: 'String', isAdmin: true },
    },
  },
  groupUser: {
    owner: {
      data: {
        status: 'JOINED',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'gu4123901' } },
          },
        },
        user: { connect: { mobile: 'gu4123901' } },
      },
    },
    member: {
      data: {
        status: 'JOINED',
        unreadPostCount: 5,
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'gu4123901' } },
          },
        },
        user: { connect: { mobile: 'gu4123902' } },
      },
    },
  },
})
