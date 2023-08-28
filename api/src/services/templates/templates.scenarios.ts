export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'temString9364825', name: 'String' }
    },
    two: {
      data: { mobile: 'temString5727830', name: 'String' }
    },
    admin: {
      data: { mobile: 'tempostString5727830', name: 'String', isAdmin: true }
    },
  },
  template: {
    one: {
      data: {
        updatedAt: '2021-08-06T14:27:22Z',
        name: 'String6917598',
        title: 'String',
        user: {
          connect: { mobile: 'temString9364825' },
        },
      }
    },
    two: {
      data: {
        updatedAt: '2021-08-06T14:27:22Z',
        name: 'String2179476',
        title: 'String',
        user: {
          connect: { mobile: 'temString5727830' },
        },
      }
    },
  },
})

export type StandardScenario = typeof standard
