import { ses } from 'src/lib/utils'
import { signInBySes, refreshToken } from './signIn'

const clientInfo = { version: '1.0.0' }

const smsCode = ses.TEST_CODE

describe('signInBySes', () => {
  it('failed with not exist mobile', async () => {
    const result = async () => {
      return await signInBySes({
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
      return await signInBySes({
        input: {
          mobile: scenario.user.one.mobile,
          smsCode: 'wrong',
          clientInfo,
        },
      })
    }

    await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Verification Code is not correct"`
    )
  })

  scenario('success', async (scenario) => {
    await ses.sendSes(scenario.user.one.mobile)

    const result = await signInBySes({
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
