import { UserInputError } from '@redwoodjs/graphql-server'
import { db } from 'src/lib/db'
import { hashPassword, jwt, sms, invite } from 'src/lib/utils'
import { User } from '@prisma/client'
import { updateUserDevice } from '../userDevices/userDevices'
import { addUserToGroupByMobile } from 'src/lib/services/group'

export const signUp = async ({ input }) => {
  const { mobile, smsCode, inviteCode, password, name, clientInfo, ...rest } =
    input

  await ensureValidPassword(password)
  await ensureValidSmsCode(mobile, smsCode)
  await ensureMobileNotTaken(mobile)
  await ensureValidInviteCode(inviteCode)

  const [invitedById, itemId, option] = await invite.getDataByInviteCode(
    inviteCode
  )

  const data = {
    ...rest,
    mobile,
    name: name || maskMobileNumber(mobile),
    password: await hashPassword(password),
    invitedById,
  }

  const user = await db.user.create({
    data,
  })

  if (option.for === 'channel') await inviteUserToChannel(user, itemId)
  if (option.for === 'group')
    await addUserToGroupByMobile({ mobile: user.mobile, groupId: itemId })

  context.currentUser = user
  context.clientInfo = clientInfo
  const token = jwt.genToken(user, clientInfo)
  await updateUserDevice(user.id)

  return {
    token,
    user,
  }
}

function maskMobileNumber(mobile) {
  return mobile.replace(/(?<=...)\d{4}/, '****')
}

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 40
export function ensureValidPassword(password: string) {
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    throw new UserInputError('密码格式不正确，长度要求：8 ~ 40', {
      messages: {
        smsCode: ['密码长度必须在 8 ~ 40 之间'],
      },
    })
  }
}

async function ensureMobileNotTaken(mobile: string) {
  const isUserExist = await db.user.findUnique({
    where: { mobile },
  })

  if (isUserExist) {
    throw new UserInputError('手机号已经存在', {
      messages: {
        mobile: ['手机号已经存在'],
      },
    })
  }
}

async function ensureValidSmsCode(mobile: string, smsCode: string) {
  const code = await sms.getVerifyCode(mobile)

  if (code !== smsCode) {
    throw new UserInputError('验证码不匹配', {
      messages: {
        smsCode: ['验证码不匹配'],
      },
    })
  }
}

async function ensureValidInviteCode(inviteCode: string) {
  const isValidInviteCode = await invite.isValid(inviteCode.toUpperCase())
  if (!isValidInviteCode) {
    throw new UserInputError('无效邀请码', {
      messages: {
        inviateCode: ['无效邀请码'],
      },
    })
  }
}

async function inviteUserToChannel(invitedUser: User, channelId: number) {
  await db.channelMember.create({
    data: {
      userId: invitedUser.id,
      channelId: channelId,
      status: 'JOINED',
    },
  })
}
