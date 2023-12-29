import {
  UserInputError,
  ValidationError,
  context,
} from '@redwoodjs/graphql-server'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'
import { compare, jwt, ses } from 'src/lib/utils'

export const signInBySes = async ({ input }) => {
  const { email, sesCode } = input

  await ses.ensureValidSesCode(email, sesCode)

  let user = await db.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    user = await db.user.create({
      data: {
        name: email,
        email,
      },
    })
  }

  context.currentUser = user
  context.clientInfo = input.clientInfo
  const token = jwt.genToken(user, input.clientInfo)

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
