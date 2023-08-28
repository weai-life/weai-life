/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sms } from 'src/lib/utils'
import { changePassword, resetPassword } from './updatePassword'

const smsCode = sms.TEST_CODE

describe('changePassword', () => {
  scenario('when current password is not valid', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const input = {
      currentPassword: 'wrong',
      newPassword: 'newpassword',
    }

    const result = changePassword({ input })
    await expect(result).rejects.toMatchInlineSnapshot(
      `[GraphQLError: 密码不匹配]`
    )
  })

  scenario('when new password is not valid', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const input = {
      currentPassword: 'password',
      newPassword: 'short',
    }

    const result = changePassword({ input })
    await expect(result).rejects.toMatchInlineSnapshot(
      `[GraphQLError: 密码格式不正确，长度要求：8 ~ 40]`
    )
  })

  scenario('success', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const input = {
      currentPassword: 'password',
      newPassword: 'newpassword',
    }

    const result = await changePassword({ input })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "message": "密码修改成功",
        "status": "SUCCESS",
      }
    `)
  })
})

describe('resetPassword', () => {
  scenario('when sms code is not valid', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const input = {
      mobile: scenario.user.one.mobile,
      smsCode: 'wrong',
      password: 'newpassword',
    }

    const result = resetPassword({ input })
    await expect(result).rejects.toMatchInlineSnapshot(
      `[GraphQLError: 验证码不匹配]`
    )
  })

  scenario('when new password is not valid', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const mobile = scenario.user.one.mobile
    sms.sendSms(mobile)

    const input = {
      mobile,
      smsCode,
      password: 'short',
    }

    const result = resetPassword({ input })
    await expect(result).rejects.toMatchInlineSnapshot(
      `[GraphQLError: 密码格式不正确，长度要求：8 ~ 40]`
    )
  })

  scenario('success', async (scenario) => {
    mockCurrentUser(scenario.user.one)
    const mobile = scenario.user.one.mobile

    sms.sendSms(mobile)

    const input = {
      mobile,
      smsCode,
      password: 'newpassword',
    }

    const result = await resetPassword({ input })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "message": "密码修改成功",
        "status": "SUCCESS",
      }
    `)
  })
})
