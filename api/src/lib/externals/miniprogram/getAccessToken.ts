import axios from 'axios'
import { logger } from 'src/lib/logger'

const URL = 'https://api.weixin.qq.com/cgi-bin/token'

export type GetAccessTokenResponse = {
  access_token: string // 获取到的凭证
  expires_in: number // 凭证有效时间，单位：秒。目前是7200秒之内的值。
  errcode: number // 错误码
  errmsg: string // 错误信息
}

export const getAccessToken: (
  appid: string,
  secret: string
) => Promise<GetAccessTokenResponse> = async (appid, secret) => {
  logger.debug('getAccessToken appid: %s, secret: %s', appid, secret)

  const res = await axios
    .get<GetAccessTokenResponse>(URL, {
      params: {
        grant_type: 'client_credential',
        appid,
        secret,
      },
    })
    .then((x) => x.data)

  logger.debug('res:: %o', res)
  return res
}
