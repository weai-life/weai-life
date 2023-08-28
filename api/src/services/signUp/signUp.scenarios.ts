export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'String2767701', name: 'String' },
    },
    two: {
      data: { mobile: 'String9767701', name: 'String' },
    },
  },
  channel: {
    one: {
      data: {
        title: 'String',
        description: 'Description',
        author: { connect: { mobile: 'String2767701' } },
      },
    },
    two: {
      data: {
        title: 'String',
        description: 'Description',
        author: { connect: { mobile: 'String9767701' } },
        group: {
          create: {
            name: 'String',
            description: 'Description',
            owner: { connect: { mobile: 'String2767701' } },
          },
        },
      },
    },
  },
})
