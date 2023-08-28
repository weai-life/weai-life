import { PhoneInfo } from './../../externals/miniprogram/getPhoneNumber'
import { getPhoneNumber } from './getPhoneNumber'
import axios from 'axios'

jest.mock('axios')

describe('getPhoneNumber', () => {
  // 失败的先测试因为成功的会 cache 住
  it('failed response', () => {
    const phoneInfo: PhoneInfo = {
      phoneNumber: '+8618012341234',
      purePhoneNumber: '18012341234',
      countryCode: '+86',
      watermark: {
        appid: '1234',
        timestamp: 1648876519128,
      },
    }
    const data = {
      errcode: 1,
      errmsg: 'errmsg',
      phone_info: phoneInfo,
    }

    const resp = { data }
    axios.post.mockResolvedValue(resp)

    const res = getPhoneNumber('accssToken', 'code')
    expect(res).rejects.toThrowErrorMatchingInlineSnapshot(`"errmsg"`)
  })

  it('successful response', async () => {
    const phoneInfo: PhoneInfo = {
      phoneNumber: '+8618012341234',
      purePhoneNumber: '18012341234',
      countryCode: '+86',
      watermark: {
        appid: '1234',
        timestamp: 1648876519128,
      },
    }
    const data = {
      errcode: 0,
      errmsg: '',
      phone_info: phoneInfo,
    }

    const resp = { data }
    axios.post.mockResolvedValue(resp)

    const res = await getPhoneNumber('accssToken', 'code')
    expect(res).toEqual(phoneInfo)
  })
})
