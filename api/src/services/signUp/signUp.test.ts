import { db } from 'src/lib/db'
import { invite, sms } from 'src/lib/utils'
import { signUp } from './signUp'

const mobile = '18011112222'
const password = 'password'
const inviteCode = 'fake'
const clientInfo = { version: '1.0.0' }

beforeAll(async () => {
  await sms.sendSms(mobile)
})

describe('signUp', () => {
  it('failed with invalid password', async () => {
    const result = async () => {
      return await signUp({
        input: {
          mobile,
          password: '123',
          smsCode: sms.TEST_CODE,
          inviteCode,
          clientInfo,
        },
      })
    }

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"密码格式不正确，长度要求：8 ~ 40"`
    )
  })

  it('failed with invalid smscode', async () => {
    const result = async () => {
      return await signUp({
        input: {
          mobile,
          password,
          smsCode: 'wrong',
          inviteCode,
          clientInfo,
        },
      })
    }

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"验证码不匹配"`
    )
  })

  scenario('failed when mobile is taken', async (scenario) => {
    sms.sendSms(scenario.user.one.mobile)

    const result = async () => {
      return await signUp({
        input: {
          mobile: scenario.user.one.mobile,
          password,
          smsCode: sms.TEST_CODE,
          inviteCode,
          clientInfo,
        },
      })
    }
    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"手机号已经存在"`
    )
  })

  it('failed when invite code is invalid', async () => {
    const result = async () => {
      return await signUp({
        input: {
          mobile,
          password,
          smsCode: sms.TEST_CODE,
          inviteCode: 'wrong',
          clientInfo,
        },
      })
    }
    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"无效邀请码"`
    )
  })

  scenario('success with a channel invite code', async (scenario) => {
    const inviteCode = await invite.genInviteCode(
      scenario.user.one.id,
      scenario.channel.one.id
    )

    const result = await signUp({
      input: {
        mobile,
        avatarUrl: null,
        password,
        smsCode: sms.TEST_CODE,
        inviteCode,
        clientInfo,
      },
    })
    expect(result).toMatchInlineSnapshot(
      {
        token: expect.any(String),
        user: {
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          id: expect.any(Number),
          password: expect.any(String),
        },
      },
      `
      Object {
        "token": Any<String>,
        "user": Object {
          "avatarUrl": null,
          "createdAt": Any<Date>,
          "id": Any<Number>,
          "invitedById": ${scenario.user.one.id},
          "isAdmin": false,
          "mobile": "18011112222",
          "name": "180****2222",
          "password": Any<String>,
          "store": Object {},
          "updatedAt": Any<Date>,
        },
      }
    `
    )

    // confirm membership
    const member = db.channelMember.findFirst({
      where: {
        channelId: scenario.channel.one.id,
        userId: result.user.id,
      },
    })

    expect(member).resolves.not.toBeNull()
  })

  scenario('success with a group invite code', async (scenario) => {
    const inviteCode = await invite.genInviteCode(
      scenario.user.one.id,
      scenario.channel.two.groupId,
      { for: 'group' }
    )

    const result = await signUp({
      input: {
        mobile,
        avatarUrl: null,
        password,
        smsCode: sms.TEST_CODE,
        inviteCode,
        clientInfo,
      },
    })
    expect(result).toMatchInlineSnapshot(
      {
        token: expect.any(String),
        user: {
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          id: expect.any(Number),
          password: expect.any(String),
        },
      },
      `
      Object {
        "token": Any<String>,
        "user": Object {
          "avatarUrl": null,
          "createdAt": Any<Date>,
          "id": Any<Number>,
          "invitedById": ${scenario.user.one.id},
          "isAdmin": false,
          "mobile": "18011112222",
          "name": "180****2222",
          "password": Any<String>,
          "store": Object {},
          "updatedAt": Any<Date>,
        },
      }
    `
    )

    // confirm user is in group
    const groupMember = await db.groupUser.findFirst({
      where: {
        userId: result.user.id,
        groupId: scenario.channel.two.groupId,
      },
    })

    expect(groupMember).not.toBeNull()

    // confirm user is in channels of group
    const channelMember = await db.channelMember.findFirst({
      where: {
        channelId: scenario.channel.two.id,
        userId: result.user.id,
      },
    })

    expect(channelMember).not.toBeNull()
  })
})
