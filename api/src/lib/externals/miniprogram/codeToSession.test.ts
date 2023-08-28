import { code2Session } from './codeToSession'
import axios from 'axios'

jest.mock('axios')

describe('code2Session', () => {
  it('response', async () => {
    const data = {
      openid: 'openid',
      session_key: 'session',
      unionid: 'unionid',
      errcode: 1,
      errmsg: 'errmsg',
    }
    const resp = { data }
    axios.get.mockResolvedValue(resp)

    const res = await code2Session('appid', 'secret', 'code')
    expect(res).toEqual(data)
  })
})
