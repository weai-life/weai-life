export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'viocatString2895398', name: 'String' },
    },
    two: {
      data: { mobile: 'viocateString9767701', name: 'String', isAdmin: true },
    },
  },
  violationCategory: {
    one: { data: { updatedAt: '2021-11-01T12:13:47Z', name: 'String' } },
    two: { data: { updatedAt: '2021-11-01T12:13:47Z', name: 'String' } },
  },
})

export type StandardScenario = typeof standard
