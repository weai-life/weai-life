export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'pageString2895398', name: 'String' },
    },
    two: {
      data: { mobile: 'pageString9767701', name: 'String' },
    },
    admin: {
      data: { mobile: 'pageString9767012', name: 'String', isAdmin: true },
    },
  },
  page: {
    one: {
      data: {
        updatedAt: '2021-08-05T10:04:02Z',
        slug: 'String6423084',
        channel: {
          create: {
            updatedAt: '2021-06-01T08:34:18Z',
            name: 'String',
            description: 'Description',
            author: { connect: { mobile: 'pageString2895398' } },
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-08-05T10:04:02Z',
        slug: 'taken',
        channel: {
          create: {
            updatedAt: '2021-06-01T08:34:18Z',
            name: 'String',
            description: 'Description',
            author: { connect: { mobile: 'pageString2895398' } },
          },
        },
      },
    },
  },
  channel: {
    one: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        name: 'String',
        description: 'Description',
        author: { connect: { mobile: 'pageString2895398' } },
        page: {
          connect: { slug: 'String6423084' },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-06-01T08:34:18Z',
        name: 'String',
        description: 'Description',
        author: { connect: { mobile: 'pageString9767701' } },
        isPublic: true,
      },
    },
  },
})

export type StandardScenario = typeof standard
