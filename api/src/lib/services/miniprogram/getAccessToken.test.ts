import { getAccessToken } from './getAccessToken'
import axios from 'axios'

jest.mock('axios')

describe('getAccessToken', () => {
  // 失败的先测试因为成功的会 cache 住
  it('failed response', () => {
    const data = {
      access_token: 'accessToken',
      expires_in: 7200,
      errcode: 1,
      errmsg: 'errmsg',
    }
    const resp = { data }
    axios.get.mockResolvedValue(resp)

    const res = getAccessToken('appid', 'secret')
    expect(res).rejects.toThrowErrorMatchingInlineSnapshot(`"errmsg"`)
  })

  it('successful response', async () => {
    const data = {
      access_token: 'accessToken',
      expires_in: 7200,
      errcode: 0,
      errmsg: '',
    }
    const resp = { data }
    axios.get.mockResolvedValue(resp)

    const res = await getAccessToken('appid', 'secret')
    expect(res).toEqual({
      accessToken: 'accessToken',
      expiresIn: 7200,
    })
  })
})
