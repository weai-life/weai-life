export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'bpString9767701', name: 'one' }
    },
    two: {
      data: { mobile: 'bpString9767702', name: 'two', isAdmin: true }
    },
    other: {
      data: { mobile: 'bpString9767703', name: 'other' }
    },
  },
  postBlock: {
    one: {
      data: {
        updatedAt: '2021-09-27T08:48:34Z',
        block: {
          create: {
            updatedAt: '2021-09-27T08:48:34Z',
            content: 'String',
            contentType: 'Text',
            user: {
              connect: {
                mobile: 'bpString9767701',
              },
            },
          },
        },
        post: {
          create: {
            updatedAt: '2021-09-27T08:48:35Z',
            content: 'String',
            author: {
              connect: {
                mobile: 'bpString9767701',
              },
            },
          },
        },
      }
    },
    two: {
      data: {
        updatedAt: '2021-09-27T08:48:35Z',
        block: {
          create: {
            updatedAt: '2021-09-27T08:48:35Z',
            content: 'String',
            contentType: 'Text',
            user: {
              create: {
                mobile: 'String9162015',
                name: 'String',
                updatedAt: '2021-09-27T08:48:35Z',
              },
            },
          },
        },
        post: {
          create: {
            updatedAt: '2021-09-27T08:48:35Z',
            content: 'String',
            author: {
              create: {
                mobile: 'String7943900',
                name: 'String',
                updatedAt: '2021-09-27T08:48:35Z',
              },
            },
          },
        },
      }
    },
  },
  block: {
    one: {
      data: {
        updatedAt: '2021-09-27T08:44:45Z',
        content: 'String',
        contentType: 'Text',
        user: {
          connect: {
            mobile: 'bpString9767701',
          },
        },
      }
    },
  },
})

export type StandardScenario = typeof standard
