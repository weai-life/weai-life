import { sms } from 'src/lib/utils'
import { signInByPassword, signInBySms, refreshToken } from './signIn'

const clientInfo = { version: '1.0.0' }

describe('signInByPassword', () => {
  it('failed with not exist mobile', async () => {
    const result = async () => {
      return await signInByPassword({
        input: {
          mobile: 'wrong',
          password: '123',
          clientInfo,
        },
      })
    }

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"手机号与密码不匹配"`
    )
  })

  scenario('failed with invalid password', async (scenario) => {
    const result = async () => {
      return await signInByPassword({
        input: {
          mobile: scenario.user.one.mobile,
          password: 'wrong',
          clientInfo,
        },
      })
    }

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"手机号与密码不匹配"`
    )
  })

  scenario('failed when password not set', async (scenario) => {
    const result = async () => {
      return await signInByPassword({
        input: {
          mobile: scenario.user.two.mobile,
          password: 'wrong',
          clientInfo,
        },
      })
    }

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"密码未设置"`
    )
  })

  scenario('success', async (scenario) => {
    const result = await signInByPassword({
      input: {
        mobile: scenario.user.one.mobile,
        password: 'password',
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
          "invitedById": null,
          "isAdmin": false,
          "mobile": "18011112222",
          "name": "String",
          "password": Any<String>,
          "store": Object {},
          "updatedAt": Any<Date>,
        },
      }
    `
    )
  })
})

const smsCode = sms.TEST_CODE

describe('signInBySms', () => {
  it('failed with not exist mobile', async () => {
    const result = async () => {
      return await signInBySms({
        input: {
          mobile: 'wrong',
          smsCode,
          clientInfo,
        },
      })
    }

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"手机号尚未注册，请先去注册页面注册"`
    )
  })

  scenario('failed with invalid SMS code', async (scenario) => {
    const result = async () => {
      return await signInBySms({
        input: {
          mobile: scenario.user.one.mobile,
          smsCode: 'wrong',
          clientInfo,
        },
      })
    }

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"验证码不匹配"`
    )
  })

  scenario('success', async (scenario) => {
    await sms.sendSms(scenario.user.one.mobile)

    const result = await signInBySms({
      input: {
        mobile: scenario.user.one.mobile,
        smsCode,
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
          "invitedById": null,
          "isAdmin": false,
          "mobile": "18011112222",
          "name": "String",
          "password": Any<String>,
          "store": Object {},
          "updatedAt": Any<Date>,
        },
      }
    `
    )
  })

  scenario('refreshToken', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await refreshToken()
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
          "invitedById": null,
          "isAdmin": false,
          "mobile": "18011112222",
          "name": "String",
          "password": Any<String>,
          "store": Object {},
          "updatedAt": Any<Date>,
        },
      }
    `
    )
  })
})
