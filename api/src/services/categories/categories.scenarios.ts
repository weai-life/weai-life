import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.CategoryCreateArgs>({
  user: {
    one: {
      data: { mobile: 'cateString9767701', name: 'owner' },
    },
  },
  category: {
    one: {
      data: {
        updatedAt: '2021-07-25T03:41:22Z',
        title: 'String',
        channel: {
          create: {
            updatedAt: '2021-07-25T03:41:22Z',
            title: 'String',
            author: {
              connect: {
                mobile: 'cateString9767701',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
