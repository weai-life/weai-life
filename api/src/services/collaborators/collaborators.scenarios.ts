import type { Prisma, Collaborator } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CollaboratorCreateArgs>({
  collaborator: {
    one: {
      data: {
        post: {
          create: {
            updatedAt: '2023-12-26T12:18:54.015Z',
            title: 'String',
            applet: { create: { name: 'String8148568', title: 'String' } },
            author: {
              create: {
                email: 'String855636',
                name: 'String',
                updatedAt: '2023-12-26T12:18:54.015Z',
              },
            },
          },
        },
        user: {
          create: {
            email: 'String1899610',
            name: 'String',
            updatedAt: '2023-12-26T12:18:54.015Z',
          },
        },
      },
    },
    two: {
      data: {
        post: {
          create: {
            updatedAt: '2023-12-26T12:18:54.015Z',
            title: 'String',
            applet: { create: { name: 'String7679862', title: 'String' } },
            author: {
              create: {
                email: 'String8344740',
                name: 'String',
                updatedAt: '2023-12-26T12:18:54.016Z',
              },
            },
          },
        },
        user: {
          create: {
            email: 'String8750904',
            name: 'String',
            updatedAt: '2023-12-26T12:18:54.016Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Collaborator, 'collaborator'>
