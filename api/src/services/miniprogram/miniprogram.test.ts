import { db } from 'src/lib/db'
import { miniprogram as mp } from 'src/lib/services'
import { mpSignIn, mpSignUp } from './miniprogram'

jest.mock('src/lib/services', () => ({
  miniprogram: {
    getPurePhoneNumber: jest.fn(),
    getAccessToken: jest.fn().mockResolvedValue({ accessToken: 'accessToken' }),
    code2Session: jest.fn(),
    storeUserAvatar: () => jest.fn(),
    getMiniProgramInfo: jest
      .fn()
      .mockResolvedValue({ appid: '1', secret: 'secret' }),
  },
}))

const userExist = (userId) =>
  db.user.count({ where: { id: userId } }).then((c) => c === 1)
const groupUserExist = (groupId, userId) =>
  db.groupUser.count({ where: { groupId, userId } }).then((c) => c === 1)
const mpUserExist = (groupId, userId) =>
  db.mpUser.count({ where: { groupId, userId } }).then((c) => c === 1)

describe('mpSignIn', () => {
  scenario('sign in user', async (scenario) => {
    const mpUser = scenario.user.mpUser
    mp.getPurePhoneNumber.mockResolvedValue(mpUser.mobile)
    mp.code2Session.mockResolvedValue({ openid: 'openid' })

    const groupId = scenario.group.one.id as number
    const input = { code: 'code', groupId }
    const { token, user } = await mpSignIn({ input })
    expect(token).not.toEqual(null)
    expect(user.id).toEqual(mpUser.id)
    expect(user.mobile).toEqual(mpUser.mobile)
    expect(userExist(user.id)).resolves.toBeTruthy()
    expect(groupUserExist(groupId, user.id)).resolves.toBeTruthy()
    expect(mpUserExist(groupId, user.id)).resolves.toBeTruthy()
  })
})

describe('mpSignUp', () => {
  const data = {
    code: 'authCode',
    phoneCode: 'phoneCode',
    nickname: 'ryan',
    avatarUrl: 'https://foo.com/bar.jpg',
  }

  describe('new user', () => {
    const mobile = '18012341234'

    scenario('create user successfully', async (scenario) => {
      mp.getPurePhoneNumber.mockResolvedValue(mobile)
      mp.code2Session.mockResolvedValue({ openid: 'openid1' })

      const groupId = scenario.group.one.id as number
      const input = { ...data, groupId }
      const { token, user } = await mpSignUp({ input })
      expect(token).not.toEqual(null)
      expect(user.id).not.toEqual(null)
      expect(user.mobile).toEqual(mobile)
      expect(user.name).toEqual('ryan')
      expect(userExist(user.id)).resolves.toBeTruthy()
      expect(groupUserExist(groupId, user.id)).resolves.toBeTruthy()
      expect(mpUserExist(groupId, user.id)).resolves.toBeTruthy()
    })
  })

  describe('new group user', () => {
    scenario('create group user successfully', async (scenario) => {
      const otherUser = scenario.user.other
      mp.getPurePhoneNumber.mockResolvedValue(otherUser.mobile)
      mp.code2Session.mockResolvedValue({ openid: 'openid2' })

      const groupId = scenario.group.one.id as number
      const input = { ...data, groupId }
      const { token, user } = await mpSignUp({ input })
      expect(token).not.toEqual(null)
      expect(user.id).toEqual(otherUser.id)
      expect(user.mobile).toEqual(otherUser.mobile)
      expect(userExist(user.id)).resolves.toBeTruthy()
      expect(groupUserExist(groupId, user.id)).resolves.toBeTruthy()
      expect(mpUserExist(groupId, user.id)).resolves.toBeTruthy()
    })
  })

  describe('existed group user', () => {
    scenario('create mp user successfully', async (scenario) => {
      const memberUser = scenario.user.member
      mp.getPurePhoneNumber.mockResolvedValue(memberUser.mobile)
      mp.code2Session.mockResolvedValue({ openid: 'openid3' })

      const groupId = scenario.group.one.id as number
      const input = { ...data, groupId }
      const { token, user } = await mpSignUp({ input })
      expect(token).not.toEqual(null)
      expect(user.id).toEqual(memberUser.id)
      expect(user.mobile).toEqual(memberUser.mobile)
      expect(userExist(user.id)).resolves.toBeTruthy()
      expect(groupUserExist(groupId, user.id)).resolves.toBeTruthy()
      expect(mpUserExist(groupId, user.id)).resolves.toBeTruthy()
    })
  })

  describe('existed mp user', () => {
    scenario('find mp user successfully', async (scenario) => {
      const mpUser = scenario.user.mpUser
      mp.getPurePhoneNumber.mockResolvedValue(mpUser.mobile)
      mp.code2Session.mockResolvedValue({ openid: 'openid' })
      const groupId = scenario.group.one.id as number
      const input = { ...data, groupId }
      const { token, user } = await mpSignUp({ input })
      expect(token).not.toEqual(null)
      expect(user.id).toEqual(mpUser.id)
      expect(user.mobile).toEqual(mpUser.mobile)
      expect(userExist(user.id)).resolves.toBeTruthy()
      expect(groupUserExist(groupId, user.id)).resolves.toBeTruthy()
      expect(mpUserExist(groupId, user.id)).resolves.toBeTruthy()
    })
  })
})
