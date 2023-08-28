import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.AttachmentCreateArgs>({
  attachment: {
    one: {
      data: {
        updatedAt: '2021-06-19T09:33:21Z',
        filename: 'String.jpg',
        user: {
          create: {
            mobile: 'String796701',
            name: 'String',
            updatedAt: '2021-06-19T09:33:21Z',
          },
        },
      }
    },
    two: {
      data: {
        updatedAt: '2021-06-19T09:33:21Z',
        filename: 'String.jpg',
        user: {
          create: {
            mobile: 'String5129467',
            name: 'String',
            updatedAt: '2021-06-19T09:33:21Z',
          },
        },
        status: 'UPLOADED',
      }
    },
  },
})

export type StandardScenario = typeof standard
