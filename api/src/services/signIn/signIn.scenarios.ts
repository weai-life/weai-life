// password = 'password'
const password = '$2a$10$ysDJqv.OUfRyuaA3.gkNNeDL.Sk5M4uOYZb.DA8DRC07ASuPo.8u6'

export const standard = defineScenario({
  user: {
    one: {
      data: {
        mobile: '18011112222',
        name: 'String',
        password,
      }
    },
    two: {
      data: { mobile: 'String9767701', name: 'String' }
    },
  },
})
