export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'userP9364825', name: 'String' },
    },
    admin: {
      data: { mobile: 'userP5727830', name: 'String', isAdmin: true },
    },
    other: {
      data: { mobile: 'userP9364826', name: 'String' },
    },
  },
})

export type StandardScenario = typeof standard
