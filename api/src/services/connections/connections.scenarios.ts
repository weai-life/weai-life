import type { Prisma, Connection } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ConnectionCreateArgs>({
  connection: {
    one: {
      data: {
        remark: 'String',
        updatedAt: '2023-12-17T05:05:17.785Z',
        sender: {
          create: {
            email: 'String7201830',
            name: 'String',
            updatedAt: '2023-12-17T05:05:17.785Z',
          },
        },
        receiver: {
          create: {
            email: 'String4288945',
            name: 'String',
            updatedAt: '2023-12-17T05:05:17.785Z',
          },
        },
      },
    },
    two: {
      data: {
        remark: 'String',
        updatedAt: '2023-12-17T05:05:17.785Z',
        sender: {
          create: {
            email: 'String5035445',
            name: 'String',
            updatedAt: '2023-12-17T05:05:17.785Z',
          },
        },
        receiver: {
          create: {
            email: 'String2631795',
            name: 'String',
            updatedAt: '2023-12-17T05:05:17.785Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Connection, 'connection'>
