import type { Prisma, PostTag } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PostTagCreateArgs>({
  postTag: {
    one: {
      data: {
        post: {
          create: {
            updatedAt: '2023-12-23T03:17:28.436Z',
            title: 'String',
            tool: { create: { name: 'String5127228', title: 'String' } },
            author: {
              create: {
                email: 'String1441951',
                name: 'String',
                updatedAt: '2023-12-23T03:17:28.436Z',
              },
            },
          },
        },
        tag: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        post: {
          create: {
            updatedAt: '2023-12-23T03:17:28.436Z',
            title: 'String',
            tool: { create: { name: 'String9377618', title: 'String' } },
            author: {
              create: {
                email: 'String8333776',
                name: 'String',
                updatedAt: '2023-12-23T03:17:28.436Z',
              },
            },
          },
        },
        tag: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<PostTag, 'postTag'>
