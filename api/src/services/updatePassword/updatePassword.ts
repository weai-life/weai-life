import { getCurrentUser } from 'src/lib/context'
import { UserInputError } from '@redwoodjs/graphql-server'
import { db } from 'src/lib/db'
import { compare, hashPassword, sms } from 'src/lib/utils'
import { ensureValidPassword } from '../signUp/signUp'

export const changePassword = async ({ input }) => {
  const { currentPassword, newPassword } = input

  const isMatch = await compare(currentPassword, getCurrentUser().password)
  if (!isMatch) {
    throw new UserInputError('密码不匹配', {
      messages: {
        currentPassword: '密码不匹配',
      },
    })
  }

  await ensureValidPassword(newPassword)

  await db.user.update({
    data: {
      password: await hashPassword(newPassword),
    },
    where: {
      id: getCurrentUser().id,
    },
  })

  return {
    status: 'SUCCESS',
    message: '密码修改成功',
  }
}

export const resetPassword = async ({ input }) => {
  const { mobile, smsCode, password } = input

  const user = await db.user.findUnique({
    where: {
      mobile,
    },
  })

  if (!user) {
    throw new UserInputError('手机号不存在', {
      messages: {
        mobile: '手机号不存在',
      },
    })
  }

  await sms.ensureValidSmsCode(mobile, smsCode)
  await ensureValidPassword(password)

  await db.user.update({
    data: {
      password: await hashPassword(password),
    },
    where: {
      mobile,
    },
  })

  return {
    status: 'SUCCESS',
    message: '密码修改成功',
  }
}
