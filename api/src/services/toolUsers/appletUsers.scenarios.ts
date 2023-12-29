import type { Prisma, ToolUser } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ToolUserCreateArgs>({
  toolUser: {
    one: { data: { updatedAt: '2023-12-06T01:21:04.739Z' } },
    two: { data: { updatedAt: '2023-12-06T01:21:04.739Z' } },
  },
})

export type StandardScenario = ScenarioData<ToolUser, 'toolUser'>
