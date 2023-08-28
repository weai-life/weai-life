// password = 'password'
const password = '$2a$10$ysDJqv.OUfRyuaA3.gkNNeDL.Sk5M4uOYZb.DA8DRC07ASuPo.8u6'

export const standard = defineScenario({
  user: {
    one: {
      data: { mobile: 'mobile4123908', name: 'String', password }
    },
  },
})
