import axios from 'axios'
import { logger } from 'src/lib/logger'

// https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/phonenumber/phonenumber.getPhoneNumber.html

const URL = 'https://api.weixin.qq.com/wxa/business/getuserphonenumber'

export type GetPhoneNumberResponse = {
  errcode: number
  errmsg: string
  phone_info: PhoneInfo
}

export type PhoneInfo = {
  phoneNumber: string //	用户绑定的手机号（国外手机号会有区号）
  purePhoneNumber: string //	没有区号的手机号
  countryCode: string //	区号
  watermark: Watermark
}

type Watermark = {
  appid: string //	小程序appid
  timestamp: number //	用户获取手机号操作的时间戳
}

export const getPhoneNumber: (
  accessToken: string,
  code: string
) => Promise<GetPhoneNumberResponse> = async (accessToken, code) => {
  logger.debug('getPhoneNumber: accessToken: %s, code: %s', accessToken, code)

  const url = `${URL}?access_token=${accessToken}`
  const res = await axios
    .post<GetPhoneNumberResponse>(url, {
      code,
    })
    .then((x) => x.data)

  logger.debug('res:: %o', res)
  return res
}
