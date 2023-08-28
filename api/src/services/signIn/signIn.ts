import { getCurrentUser } from 'src/lib/context'
import {
  UserInputError,
  ValidationError,
  context,
} from '@redwoodjs/graphql-server'
import { db } from 'src/lib/db'
import { compare, jwt, sms } from 'src/lib/utils'
import { updateUserDevice } from '../userDevices/userDevices'

export const signInByPassword = async ({ input }) => {
  const { mobile, password } = input

  const user = await db.user.findUnique({
    where: {
      mobile,
    },
  })

  if (!user) {
    // run compare to avoid time attack
    await compare(password, 'not_exists')
    throw new UserInputError('手机号与密码不匹配', {
      messages: {
        password: '手机号与密码不匹配',
      },
    })
  }

  if (!user.password) {
    throw new ValidationError('密码未设置')
  }

  const isMatch = await compare(password, user.password)
  if (!isMatch) {
    throw new UserInputError('手机号与密码不匹配', {
      messages: {
        password: '手机号与密码不匹配',
      },
    })
  }

  context.currentUser = user
  context.clientInfo = input.clientInfo
  const token = jwt.genToken(user, input.clientInfo)
  await updateUserDevice(user.id)

  return {
    token,
    user,
  }
}

export const signInBySms = async ({ input }) => {
  const { mobile, smsCode } = input

  const user = await db.user.findUnique({
    where: {
      mobile,
    },
  })

  if (!user) {
    throw new UserInputError('手机号尚未注册，请先去注册页面注册', {
      messages: {
        mobile: '手机号不存在',
      },
    })
  }

  await sms.ensureValidSmsCode(mobile, smsCode)

  context.currentUser = user
  context.clientInfo = input.clientInfo
  const token = jwt.genToken(user, input.clientInfo)
  await updateUserDevice(user.id)

  return {
    token,
    user,
  }
}

export const refreshToken = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = getCurrentUser()
  const token = jwt.genToken(user, context.clientInfo)

  return {
    token,
    user,
  }
}
