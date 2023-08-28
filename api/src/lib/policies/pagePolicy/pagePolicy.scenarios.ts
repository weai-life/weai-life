export const standard = defineScenario({
  user: {
    groupOwner: {
      data: { mobile: 'pageP2895399', name: 'String' },
    },
    owner: {
      data: { mobile: 'pageP2895398', name: 'String' },
    },
    other: {
      data: { mobile: 'pageP9767701', name: 'String' },
    },
    manager: {
      data: { mobile: 'pageP9767702', name: 'String' },
    },
    member: {
      data: { mobile: 'pageP9767703', name: 'String' },
    },
    admin: {
      data: { mobile: 'pageP9767012', name: 'String', isAdmin: true },
    },
    createPage: {
      data: { mobile: 'pageP9767711', name: 'String' },
    },
    updatePage: {
      data: { mobile: 'pageP9767712', name: 'String' },
    },
    deletePage: {
      data: { mobile: 'pageP9767713', name: 'String' },
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
            title: 'String',
            description: 'Description',
            author: { connect: { mobile: 'pageP2895398' } },
            channelMembers: {
              create: [
                {
                  user: { connect: { mobile: 'pageP9767702' } },
                  updatedAt: '2021-06-01T09:59:29Z',
                  status: 'JOINED',
                  isAdmin: true,
                },
                {
                  user: { connect: { mobile: 'pageP9767703' } },
                  updatedAt: '2021-06-01T09:59:29Z',
                  status: 'JOINED',
                  isAdmin: false,
                },
              ],
            },
            group: {
              create: {
                name: 'one',
                owner: { connect: { mobile: 'pageP2895399' } },
                roles: {
                  create: [
                    {
                      name: 'createPage',
                      users: {
                        connect: [{ mobile: 'pageP9767711' }],
                      },
                      permissions: {
                        create: [
                          {
                            key: 'CREATE_PAGE',
                            name: 'CREATE_PAGE',
                          },
                        ],
                      },
                    },
                    {
                      name: 'updatePage',
                      users: {
                        connect: [{ mobile: 'pageP9767712' }],
                      },
                      permissions: {
                        create: [
                          {
                            key: 'UPDATE_PAGE',
                            name: 'UPDATE_PAGE',
                          },
                        ],
                      },
                    },
                    {
                      name: 'deletePage',
                      users: {
                        connect: [{ mobile: 'pageP9767713' }],
                      },
                      permissions: {
                        create: [
                          {
                            key: 'DELETE_PAGE',
                            name: 'DELETE_PAGE',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
