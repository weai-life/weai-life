export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'TodoP2767700', name: 'String', isAdmin: true },
    },
    owner: {
      data: { mobile: 'TodoP2767701', name: 'String' },
    },
    assignee: {
      data: { mobile: 'TodoP2767702', name: 'String' },
    },
    other: {
      data: { mobile: 'TodoP2767703', name: 'String' },
    },
  },
  todo: {
    one: {
      data: {
        updatedAt: '2021-12-23T07:28:37Z',
        completed: false,
        deadline: '2021-12-23T07:28:37Z',
        user: { connect: { mobile: 'TodoP2767701' } },
        assignees: { connect: [{ mobile: 'TodoP2767702' }] },
        post: {
          create: {
            updatedAt: '2021-12-23T07:28:37Z',
            author: { connect: { mobile: 'TodoP2767701' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
