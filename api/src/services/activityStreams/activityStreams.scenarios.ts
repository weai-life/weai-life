import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.ActivityStreamCreateArgs>({
  activityStream: {
    one: {
      data: {
        updatedAt: '2021-09-18T07:13:41Z',
        data: { foo: 'bar' },
        user: {
          create: {
            mobile: 'actStream9284851',
            name: 'String',
            updatedAt: '2021-09-18T07:13:41Z',
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2021-09-18T07:13:41Z',
        data: { foo: 'bar' },
        user: {
          create: {
            mobile: 'actStream9865261',
            name: 'String',
            updatedAt: '2021-09-18T07:13:41Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
