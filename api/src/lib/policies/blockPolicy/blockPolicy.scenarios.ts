export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'blP9767702', name: 'admin', isAdmin: true },
    },
    owner: {
      data: { mobile: 'blP9767701', name: 'owner' },
    },
    other: {
      data: { mobile: 'blP9767703', name: 'other' },
    },
  },
  block: {
    one: {
      data: {
        updatedAt: '2021-09-27T08:44:45Z',
        content: '{ text: "String" }',
        contentType: 'Text',
        searchText: 'i love you',
        user: {
          connect: {
            mobile: 'blP9767701',
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-09-27T08:44:45Z',
        content: '{ text: "String" }',
        contentType: 'Text',
        user: {
          create: {
            mobile: 'blP9767709',
            name: 'String',
            updatedAt: '2021-09-27T08:44:45Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
