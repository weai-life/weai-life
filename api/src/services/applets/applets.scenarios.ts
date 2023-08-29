import type { Prisma, Applet } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AppletCreateArgs>({
  applet: {
    one: { data: { name: 'String', title: 'String' } },
    two: { data: { name: 'String', title: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Applet, 'applet'>
