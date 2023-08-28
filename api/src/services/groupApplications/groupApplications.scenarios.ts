import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.GroupApplicationCreateArgs>({
  user: {
    owner: {
      data: { mobile: 'groupA4123901', name: 'String' },
    },
    member: {
      data: { mobile: 'groupA4123902', name: 'String' },
    },
    other: {
      data: { mobile: 'groupA4123903', name: 'String' },
    },
    admin: {
      data: { mobile: 'groupA4123909', name: 'String', isAdmin: true },
    },
  },
  groupApplication: {
    one: {
      data: {
        content: 'String',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'groupA4123901' } },
          },
        },
        user: {
          connect: { mobile: 'groupA4123903' },
        },
      },
    },
    two: {
      data: {
        content: 'String',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'groupA4123901' } },
          },
        },
        user: {
          connect: { mobile: 'groupA4123903' },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
