import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.PermissionCreateArgs>({
  permission: {
    one: {
      data: { updatedAt: '2022-01-02T14:17:54Z', key: 'one', name: 'one' },
    },
    two: {
      data: { updatedAt: '2022-01-02T14:17:54Z', key: 'two', name: 'two' },
    },
  },
})

export type StandardScenario = typeof standard
