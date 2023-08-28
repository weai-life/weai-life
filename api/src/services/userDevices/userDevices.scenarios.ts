// password = 'password'
const password = '$2a$10$ysDJqv.OUfRyuaA3.gkNNeDL.Sk5M4uOYZb.DA8DRC07ASuPo.8u6'

export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'user4123908', name: 'String', password }
    },
    two: {
      data: { mobile: 'user4123909', name: 'String', password }
    },
    three: {
      data: { mobile: 'user4123900', name: 'String', password }
    },
  },
  userDevice: {
    one: {
      data: {
        user: { connect: { mobile: 'user4123908' } },
        devices: ['one'],
      }
    },
    two: {
      data: {
        user: { connect: { mobile: 'user4123909' } },
        devices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      }
    },
    three: {
      data: {
        user: { create: { mobile: 'user4123901', name: 'String', password } },
        devices: ['none'],
      }
    },
  },
})
