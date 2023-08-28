import { logger } from 'src/lib/logger'
import { User } from '@prisma/client'
import { UserInputError } from '@redwoodjs/graphql-server'
import { miniprogram } from 'src/lib/services'
import { db } from 'src/lib/db'
import { jwt, sms, rejectNil } from 'src/lib/utils'
import { ensureValidPassword } from '../signUp/signUp'
import { addUserToGroupByMobile } from 'src/lib/services/group'
import { getCurrentUser } from 'src/lib/context'

const {
  code2Session,
  getAccessToken,
  getMiniProgramInfo,
  getPurePhoneNumber,
  storeUserAvatar,
} = miniprogram

type MpSignInInput = {
  input: {
    groupId: number
    code: string
  }
}

type MpSignInBySmsCodeInput = {
  input: {
    groupId: number
    code: string
    smsCode: string
  } & UserInfo
}

type MpSignUpInput = {
  input: {
    groupId: number
    code: string
    phoneCode: string
  } & UserInfoWithoutMobile
}

type UserInfo = {
  mobile: string
} & UserInfoWithoutMobile

type UserInfoWithoutMobile = {
  nickname: string
  avatarUrl: string
  gender?: number
  country?: string
  province?: string
  city?: string
  language?: string
}

type CreateUserInput = UserInfo & { password?: string }

const getUser = (mobile: string) => db.user.findUnique({ where: { mobile } })
const getUserById = (id: number) => db.user.findUnique({ where: { id } })

// const validPassword = (password: string, digestPassword: string) =>
//   compare(password, digestPassword)

// export async function mpSignInByPassword(input: MpSignInByPasswordInput) {
//   const { groupId, code, mobile, password } = input
//   const user = await getUser(mobile)

//   if (!user) throw new ForbiddenError('用户不存在')

//   if (!user.password || !(await validPassword(password, user.password))) {
//     throw new Error('密码错误')
//   }

//   const openid = await getOpenId(groupId, code)
//   await findOrCreateGroupUser(groupId, user.id)
//   await findOrCreateMpUser(groupId, user.id, openid)

//   const token = getToken(user)
//   return { success: true, user, token }
// }

async function getOpenId(groupId: number, code: string) {
  const { appid, secret } = await getMiniProgramInfo(groupId)
  const res = await code2Session(appid, secret, code)
  return res.openid
}

async function getPhoneNumber(groupId: number, phoneCode: string) {
  const { appid, secret } = await getMiniProgramInfo(groupId)
  const { accessToken } = await getAccessToken(appid, secret)
  return getPurePhoneNumber(accessToken, phoneCode)
}

export async function mpSignInBySmsCode({ input }: MpSignInBySmsCodeInput) {
  const { groupId, code, mobile, smsCode } = input
  await sms.ensureValidSmsCode(mobile, smsCode)

  let user = await getUser(mobile)
  if (!user) user = await createUser(input)

  const openid = await getOpenId(groupId, code)
  await findOrCreateGroupUser(groupId, user)
  const mpUser = await findOrCreateMpUser(groupId, user.id, openid)

  return getAuthPayload(user, mpUser.openid, groupId)
}

export async function mpSignIn({ input }: MpSignInInput) {
  const { groupId, code } = input
  const openid = await getOpenId(groupId, code)
  const mpUser = await findMpUserByOpenId(groupId, openid).then(
    rejectNil('未找到用户')
  )
  const user = await getUserById(mpUser.userId).then(rejectNil('未找到用户'))

  if (!user) throw new UserInputError('用户不存在')

  return getAuthPayload(user, mpUser.openid, groupId)
}

const findMpUserByOpenId = async (groupId: number, openid: string) => {
  return await db.mpUser.findUnique({
    where: {
      groupId_openid: {
        groupId,
        openid,
      },
    },
  })
}

const getToken = (user, openid, groupId) => {
  const clientInfo: jwt.ClientInfo = {
    version: '1.0.0',
    platform: 'miniapp',
    groupId,
    openid,
  }

  return jwt.genToken(user, clientInfo)
}

const getAuthPayload = (user, openid, groupId) => {
  const token = getToken(user, openid, groupId)
  return { user, token }
}

export async function mpSignUp({ input }: MpSignUpInput) {
  const { groupId, code, phoneCode, ...userInfo } = input
  const mobile = await getPhoneNumber(groupId, phoneCode)
  const user = await findOrCreateUser({ ...userInfo, mobile })
  const openid = await getOpenId(groupId, code)

  await findOrCreateGroupUser(groupId, user)
  const mpUser = await findOrCreateMpUser(groupId, user.id, openid)

  return getAuthPayload(user, mpUser.openid, groupId)
}

const findOrCreateMpUser = async (
  groupId: number,
  userId: number,
  openid: string
) =>
  (await findMpUser(groupId, userId, openid)) ||
  (await createMpUser(groupId, userId, openid))

const findMpUser = (groupId: number, userId: number, openid: string) =>
  db.mpUser.findFirst({
    where: {
      groupId,
      userId,
      openid,
    },
  })

const createMpUser = (groupId: number, userId: number, openid: string) =>
  db.mpUser.create({
    data: {
      groupId,
      userId,
      openid,
    },
  })

const findOrCreateGroupUser = async (groupId: number, user: User) =>
  (await findGroupUser(groupId, user.id)) ||
  (await addUserToGroupByMobile({ groupId, mobile: user.mobile }))

const findGroupUser = async (groupId: number, userId: number) =>
  db.groupUser.findFirst({ where: { groupId, userId, status: 'JOINED' } })

const findOrCreateUser = async (userInfo: UserInfo) => {
  return (await findUser(userInfo.mobile)) || (await createUser(userInfo))
}

const findUser = (mobile: string) => db.user.findUnique({ where: { mobile } })

const createUser = async ({
  nickname,
  mobile,
  avatarUrl,
  password,
}: CreateUserInput) => {
  if (password) ensureValidPassword(password)

  const user = await db.user.create({
    data: {
      name: nickname,
      password,
      mobile,
      avatarUrl,
    },
  })

  storeUserAvatar(avatarUrl)(user) // no wait
  return user
}

export async function cacheMpUserAvatar({ userId }) {
  const user = getCurrentUser()

  if (!user.isAdmin) return

  const updateUser = await getUserById(userId).then(rejectNil('未找到'))

  logger.debug(`user: %o`, updateUser)

  if (!updateUser.avatarUrl) {
    logger.debug('user has no avatarUrl')
    return
  }
  if (updateUser.avatarUrl.indexOf('https://thirdwx.qlogo.cn/') != 0) {
    logger.debug('user avatar is not a wechat avatar')
    return
  }

  logger.debug('start to cache user avatar')
  storeUserAvatar(updateUser.avatarUrl)(updateUser)
  return updateUser
}
