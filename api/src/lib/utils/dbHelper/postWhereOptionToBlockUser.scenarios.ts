export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'dbh289539801', name: 'String' },
    },
    block: {
      data: { mobile: 'dbh289539802', name: 'String' },
    },
  },
  blockUser: {
    one: {
      data: {
        updatedAt: '2021-08-05T10:04:02Z',
        user: { connect: { mobile: 'dbh289539801' } },
        blockedUser: { connect: { mobile: 'dbh289539802' } },
      },
    },
  },
  post: {
    one: {
      data: {
        updatedAt: '2021-06-01T08:47:04Z',
        title: 'String',
        content: 'String',
        isDraft: false,
        publishedAt: '2021-06-01T08:47:04Z',
        author: { connect: { mobile: 'dbh289539801' } },
      },
    },
    two: {
      data: {
        updatedAt: '2021-06-01T08:47:04Z',
        title: 'String',
        content: 'String',
        isDraft: true,
        publishedAt: null,
        author: { connect: { mobile: 'dbh289539802' } },
      },
    },
  },
})
