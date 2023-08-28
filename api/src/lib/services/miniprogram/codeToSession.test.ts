import { code2Session } from './codeToSession'
import axios from 'axios'

jest.mock('axios')

describe('code2Session', () => {
  it('successful response', async () => {
    const data = {
      openid: 'openid',
      session_key: 'session',
      unionid: 'unionid',
      errcode: 0,
      errmsg: '',
    }
    const resp = { data }
    axios.get.mockResolvedValue(resp)

    const res = await code2Session('appid', 'secret', 'code')
    expect(res).toEqual({
      openid: 'openid',
      unionid: 'unionid',
      session_key: 'session',
    })
  })

  it('failed response', () => {
    const data = {
      openid: 'openid',
      session_key: 'session',
      unionid: 'unionid',
      errcode: 1,
      errmsg: 'errmsg',
    }
    const resp = { data }
    axios.get.mockResolvedValue(resp)

    const res = code2Session('appid', 'secret', 'code')
    expect(res).rejects.toThrowErrorMatchingInlineSnapshot(`"errmsg"`)
  })
})
