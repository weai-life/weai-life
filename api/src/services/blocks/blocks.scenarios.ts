export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'blString9767701', name: 'one' }
    },
    two: {
      data: { mobile: 'blString9767702', name: 'two', isAdmin: true }
    },
    other: {
      data: { mobile: 'blString9767703', name: 'other' }
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
            mobile: 'blString9767701',
          },
        },
      }
    },
    two: {
      data: {
        updatedAt: '2021-09-27T08:44:45Z',
        content: '{ text: "String" }',
        contentType: 'Text',
        user: {
          create: {
            mobile: 'String5552311',
            name: 'String',
            updatedAt: '2021-09-27T08:44:45Z',
          },
        },
      }
    },
  },
})

export type StandardScenario = typeof standard
