import type { Prisma, Page } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PageCreateArgs>({
  page: {
    one: {
      data: {
        title: 'String',
        owner: {
          create: {
            email: 'String4096519',
            name: 'String',
            updatedAt: '2023-12-25T13:09:57.203Z',
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        owner: {
          create: {
            email: 'String2858556',
            name: 'String',
            updatedAt: '2023-12-25T13:09:57.203Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Page, 'page'>
