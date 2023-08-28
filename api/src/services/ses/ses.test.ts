/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { redis } from 'src/lib/utils'
import { sendSesCode } from './ses'

const email = 'test@test.com'

beforeAll(() => {
  redis.flushdb()
})

describe('Send SMS Code', () => {
  it('Send Successfully', async () => {
    const result = await sendSesCode({ input: { email } })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "message": "Verification Code Send Successfully",
        "status": "SENT",
      }
    `)
  })

  it('Duplicate Send', async () => {
    const result = await sendSesCode({ input: { email } })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "message": "Last verfification code not yet expired",
        "status": "NOT_EXPIRED",
      }
    `)
  })
})
