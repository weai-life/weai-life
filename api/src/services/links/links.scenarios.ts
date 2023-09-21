import type { Prisma, Link } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LinkCreateArgs>({
  link: {
    one: {
      data: {
        title: 'String',
        url: 'String',
        group: {
          create: {
            name: 'String',
            owner: {
              create: {
                email: 'String5273154',
                name: 'String',
                updatedAt: '2023-09-21T11:31:17.807Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        url: 'String',
        group: {
          create: {
            name: 'String',
            owner: {
              create: {
                email: 'String2044110',
                name: 'String',
                updatedAt: '2023-09-21T11:31:17.808Z',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Link, 'link'>
