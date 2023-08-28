/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { redis } from 'src/lib/utils'
import { sendSmsCode } from './sms'

const mobile = '98000001111'

beforeAll(() => {
  redis.flushdb()
})

describe('Send SMS Code', () => {
  it('发送成功', async () => {
    const result = await sendSmsCode({ input: { mobile } })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "message": "短信发送成功",
        "status": "SENT",
      }
    `)
  })

  it('重复发送', async () => {
    const result = await sendSmsCode({ input: { mobile } })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "message": "没有过期可以用上次的验证码",
        "status": "NOT_EXPIRED",
      }
    `)
  })
})
