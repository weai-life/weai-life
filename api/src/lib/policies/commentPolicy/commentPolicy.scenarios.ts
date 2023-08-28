export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'commP123908', name: 'String', isAdmin: true },
    },
    member: {
      data: { mobile: 'commP123909', name: 'String' },
    },
    other: {
      data: { mobile: 'commP123900', name: 'String' },
    },
    owner: {
      data: { mobile: 'commP123903', name: 'String' },
    },
  },
  comment: {
    one: {
      data: {
        content: 'String',
        author: {
          connect: {
            mobile: 'commP123903',
          },
        },
        post: {
          create: {
            updatedAt: '2021-06-01T08:47:04Z',
            title: 'String',
            content: 'String',
            isDraft: false,
            publishedAt: '2021-06-01T08:47:04Z',
            author: {
              connect: {
                mobile: 'commP123903',
              },
            },
          },
        },
      },
    },
  },
})
