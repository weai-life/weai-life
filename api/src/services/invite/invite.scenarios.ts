export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'invite4123908', name: 'String' },
    },
    two: {
      data: { mobile: 'invite4232348', name: 'String' },
    },
  },
  channel: {
    one: {
      data: {
        name: 'String',
        description: 'Description',
        author: { connect: { mobile: 'invite4123908' } },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'Description',
        author: { connect: { mobile: 'invite4232348' } },
      },
    },
  },
  group: {
    one: {
      data: {
        name: 'String',
        description: 'Description',
        owner: { connect: { mobile: 'invite4123908' } },
      },
    },
  },
})
