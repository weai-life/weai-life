import type { Prisma, AppletUserTag } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AppletUserTagCreateArgs>({
  appletUserTag: {
    one: {
      data: {
        appletUser: {
          create: {
            updatedAt: '2023-12-23T03:17:03.338Z',
            applet: { create: { name: 'String1881892', title: 'String' } },
            user: {
              create: {
                email: 'String7343170',
                name: 'String',
                updatedAt: '2023-12-23T03:17:03.339Z',
              },
            },
          },
        },
        tag: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        appletUser: {
          create: {
            updatedAt: '2023-12-23T03:17:03.339Z',
            applet: { create: { name: 'String8123187', title: 'String' } },
            user: {
              create: {
                email: 'String1098173',
                name: 'String',
                updatedAt: '2023-12-23T03:17:03.339Z',
              },
            },
          },
        },
        tag: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<AppletUserTag, 'appletUserTag'>
