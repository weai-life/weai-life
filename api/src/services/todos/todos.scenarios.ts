export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'Todo2767701', name: 'String' },
    },
    two: {
      data: { mobile: 'Todo2767702', name: 'String' },
    },
  },
  todo: {
    one: {
      data: {
        updatedAt: '2021-12-23T07:28:37Z',
        completed: false,
        deadline: '2021-12-23T07:28:37Z',
        user: { connect: { mobile: 'Todo2767701' } },
        assignees: { connect: [{ mobile: 'Todo2767701' }] },
        post: {
          create: {
            updatedAt: '2021-12-23T07:28:37Z',
            author: { connect: { mobile: 'Todo2767701' } },
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-12-23T07:28:38Z',
        completed: false,
        deadline: '2022-12-23T07:28:38Z',
        jid: 'fakeid',
        timerAt: '2022-12-22T07:28:38Z',
        user: { connect: { mobile: 'Todo2767701' } },
        assignees: { connect: [{ mobile: 'Todo2767702' }] },
        post: {
          create: {
            updatedAt: '2021-12-23T07:28:38Z',
            author: { connect: { mobile: 'Todo2767701' } },
          },
        },
      },
    },
  },
  post: {
    one: {
      data: {
        updatedAt: '2021-12-23T07:28:37Z',
        author: { connect: { mobile: 'Todo2767701' } },
      },
    },
  },
})

export type StandardScenario = typeof standard
