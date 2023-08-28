import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.PostLikeCreateArgs>({
  postLike: {
    one: {
      data: {
        user: {
          create: {
            mobile: 'String7270520',
            name: 'String',
            updatedAt: '2021-07-08T06:03:34Z',
          },
        },
        post: {
          create: {
            updatedAt: '2021-07-08T06:03:34Z',
            content: 'String',
            likesCount: 10,
            author: {
              create: {
                mobile: 'String780245',
                name: 'String',
                updatedAt: '2021-07-08T06:03:34Z',
              },
            },
          },
        },
      }
    },
    two: {
      data: {
        user: {
          create: {
            mobile: 'String8938504',
            name: 'String',
            updatedAt: '2021-07-08T06:03:34Z',
          },
        },
        post: {
          create: {
            updatedAt: '2021-07-08T06:03:34Z',
            content: 'String',
            likesCount: 10,
            author: {
              create: {
                mobile: 'String9255400',
                name: 'String',
                updatedAt: '2021-07-08T06:03:34Z',
              },
            },
          },
        },
      }
    },
  },
})

export type StandardScenario = typeof standard
